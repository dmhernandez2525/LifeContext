import { expect, test, type Page } from '@playwright/test';

interface HelpWindow extends Window {
  __helpFrameDeltas?: number[];
}

const seedSession = async (page: Page): Promise<void> => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('lcc-security', JSON.stringify({ initializedForE2E: true }));
  });
};

const openAskDocsModal = async (page: Page): Promise<void> => {
  await page.getByTestId('ask-docs-toggle').click();
  await expect(page.getByTestId('ask-docs-modal')).toBeVisible();
};

test.describe('Voice Docs UX', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page);
    await page.goto('/help');
  });

  test('keeps floating trigger above page content and persists drag position', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('Mobile'), 'Desktop drag validation');

    const trigger = page.getByTestId('ask-docs-toggle');
    const zIndex = await trigger.evaluate((element) => {
      const z = window.getComputedStyle(element).zIndex;
      return Number(z);
    });
    expect(zIndex).toBeGreaterThanOrEqual(60);

    const box = await trigger.boundingBox();
    if (!box) {
      throw new Error('Unable to get floating trigger bounds');
    }

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(30, 180, { steps: 8 });
    await page.mouse.up();

    const position = await page.evaluate(() => {
      const raw = localStorage.getItem('lcc-help-trigger-position');
      if (!raw) {
        return { x: -1, y: -1 };
      }
      return JSON.parse(raw) as { x: number; y: number };
    });

    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.y).toBeGreaterThanOrEqual(0);
  });

  test('opens and animates modal with stable frame cadence', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('Mobile'), 'Desktop animation sampling');

    await page.evaluate(() => {
      const helpWindow = window as HelpWindow;
      const deltas: number[] = [];
      let previous = performance.now();
      const endAt = previous + 450;

      const sample = (now: number): void => {
        deltas.push(now - previous);
        previous = now;
        if (now < endAt) {
          requestAnimationFrame(sample);
          return;
        }
        helpWindow.__helpFrameDeltas = deltas;
      };

      requestAnimationFrame(sample);
    });

    await page.getByTestId('ask-docs-toggle').click();
    await page.waitForTimeout(500);

    const stats = await page.evaluate(() => {
      const helpWindow = window as HelpWindow;
      const deltas = helpWindow.__helpFrameDeltas ?? [];
      const positive = deltas.filter((value) => value > 0);
      const worst = positive.length > 0 ? Math.max(...positive) : 999;
      return { samples: positive.length, worst };
    });

    expect(stats.samples).toBeGreaterThan(5);
    expect(stats.worst).toBeLessThan(80);
  });

  test('supports voice input transcription with Web Speech API', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('Mobile'), 'Desktop speech mock');

    await page.addInitScript(() => {
      interface ResultLike {
        isFinal: boolean;
        0: { transcript: string };
      }

      class MockRecognition {
        continuous = false;
        interimResults = true;
        lang = 'en-US';
        onresult: ((event: { resultIndex: number; results: ResultLike[] }) => void) | null = null;
        onerror: (() => void) | null = null;
        onend: (() => void) | null = null;

        start(): void {
          const results: ResultLike[] = [{ isFinal: true, 0: { transcript: 'export backup settings' } }];
          this.onresult?.({ resultIndex: 0, results });
          this.onend?.();
        }

        stop(): void {}
      }

      const helpWindow = window as Window & { webkitSpeechRecognition?: new () => MockRecognition; SpeechRecognition?: new () => MockRecognition };
      helpWindow.webkitSpeechRecognition = MockRecognition;
      helpWindow.SpeechRecognition = MockRecognition;
    });

    await seedSession(page);
    await page.goto('/help');
    await openAskDocsModal(page);

    await page.getByTestId('ask-docs-voice-toggle').click();
    await expect(page.locator('[data-help-input]')).toHaveValue('export backup settings');
  });

  test('routes quick actions to expected destinations', async ({ page }) => {
    await openAskDocsModal(page);
    await page.getByTestId('help-quick-action-export').click();

    await expect(page).toHaveURL(/\/app\/settings#export/);
  });

  test('stores response feedback when user rates answer quality', async ({ page }) => {
    await openAskDocsModal(page);
    await page.locator('[data-help-input]').fill('how do I use this page?');
    await page.getByTestId('ask-docs-send').click();

    await expect(page.getByTestId('help-feedback-up')).toBeVisible();
    await page.getByTestId('help-feedback-up').click();

    const feedbackCount = await page.evaluate(() => {
      const raw = localStorage.getItem('lcc-help-feedback');
      if (!raw) {
        return 0;
      }

      const parsed = JSON.parse(raw) as Array<{ value?: string }>;
      return parsed.filter((entry) => entry.value === 'up').length;
    });

    expect(feedbackCount).toBeGreaterThan(0);
  });

  test('keeps modal theme synchronized with current app theme', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('Mobile'), 'Desktop theme toggle selector');

    await openAskDocsModal(page);
    const initialTheme = await page.getByTestId('ask-docs-modal').getAttribute('data-theme-mode');

    await page.getByLabel('Toggle theme').click();
    const nextTheme = await page.getByTestId('ask-docs-modal').getAttribute('data-theme-mode');

    expect(initialTheme).not.toBeNull();
    expect(nextTheme).not.toBeNull();
    expect(nextTheme).not.toBe(initialTheme);
  });
});
