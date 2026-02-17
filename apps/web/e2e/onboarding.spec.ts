import { expect, test, type Page } from '@playwright/test';

const setFreshOnboardingState = async (page: Page): Promise<void> => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('lcc-onboarding-variant', 'control');
  });
};

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setFreshOnboardingState(page);
  });

  test('shows skip confirmation before leaving onboarding', async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('onboarding-skip-button').click();
    await expect(page.getByText('Skip onboarding setup?')).toBeVisible();

    await page.getByRole('button', { name: 'Continue setup' }).click();
    await expect(page.getByText('Skip onboarding setup?')).not.toBeVisible();

    await page.getByTestId('onboarding-skip-button').click();
    await page.getByTestId('onboarding-skip-confirm').click();

    await expect(page.getByText('Set Your Master Passcode')).toBeVisible();
    const isComplete = await page.evaluate(() => localStorage.getItem('lcc-onboarding-complete'));
    expect(isComplete).toBe('true');
  });

  test('persists onboarding progress across page reload', async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('onboarding-next-button').click();
    await page.getByTestId('onboarding-intent-legacy').click();
    await page.getByTestId('onboarding-next-button').click();

    await expect(page.getByRole('heading', { name: 'Zero-Knowledge by Default' })).toBeVisible();
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Zero-Knowledge by Default' })).toBeVisible();

    const currentStepIndex = await page.evaluate(() => {
      const raw = localStorage.getItem('lcc-onboarding-progress');
      if (!raw) {
        return -1;
      }

      const parsed = JSON.parse(raw) as { currentStepIndex?: number };
      return parsed.currentStepIndex ?? -1;
    });

    expect(currentStepIndex).toBe(2);
  });

  test('applies personalized onboarding path based on selected intent', async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('onboarding-next-button').click();
    await page.getByTestId('onboarding-intent-therapy').click();
    await page.getByTestId('onboarding-next-button').click();

    await expect(page.getByRole('heading', { name: 'Zero-Knowledge by Default' })).toBeVisible();

    await page.getByTestId('onboarding-next-button').click();
    await expect(page.getByRole('heading', { name: 'Data Reclamation Setup' })).toBeVisible();

    await page.getByTestId('onboarding-next-button').click();
    await expect(page.getByRole('heading', { name: 'Confirm Passcode Responsibility' })).toBeVisible();
  });

  test('tracks onboarding completion analytics for completed sessions', async ({ page }) => {
    await page.goto('/register');

    await page.getByTestId('onboarding-next-button').click();
    await page.getByTestId('onboarding-intent-journaling').click();
    await page.getByTestId('onboarding-quick-start').click();
    await page.getByTestId('onboarding-next-button').click();

    await page.getByTestId('onboarding-passcode-confirm').click();
    await page.getByPlaceholder('Type the phrase above...').fill('I understand I cannot get this back');
    await page.getByRole('button', { name: 'I Confirm' }).click();

    await page.getByTestId('onboarding-next-button').click();
    await expect(page.getByTestId('onboarding-summary')).toBeVisible();

    await page.getByTestId('onboarding-next-button').click();
    await expect(page.getByText('Set Your Master Passcode')).toBeVisible();

    const analytics = await page.evaluate(() => {
      const raw = localStorage.getItem('lcc-onboarding-analytics');
      if (!raw) {
        return { sessionCount: 0, completedCount: 0 };
      }

      const parsed = JSON.parse(raw) as {
        sessions?: Array<{ status?: string; stepDurationsMs?: Record<string, number> }>;
      };

      const sessions = parsed.sessions ?? [];
      const completed = sessions.filter((session) => session.status === 'completed');
      const hasDurations = completed.some((session) => Object.keys(session.stepDurationsMs ?? {}).length > 0);

      return {
        sessionCount: sessions.length,
        completedCount: completed.length,
        hasDurations,
      };
    });

    expect(analytics.sessionCount).toBeGreaterThan(0);
    expect(analytics.completedCount).toBeGreaterThan(0);
    expect(analytics.hasDurations).toBe(true);
  });
});
