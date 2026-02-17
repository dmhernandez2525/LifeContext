import { expect, test, type Page } from '@playwright/test';

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

const submitHelpQuery = async (page: Page, query: string): Promise<void> => {
  await page.locator('[data-help-input]').fill(query);
  await page.getByTestId('ask-docs-send').click();
};

test.describe('Voice Docs Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page);
    await page.goto('/help');
  });

  test('parses navigation commands and routes to journal', async ({ page }) => {
    await openAskDocsModal(page);
    await submitHelpQuery(page, 'take me to journal');

    await expect(page).toHaveURL(/\/app\/journal/);
  });

  test('shows contextual suggestions for the current help section', async ({ page }) => {
    await openAskDocsModal(page);

    await expect(page.getByRole('button', { name: 'Take me to roadmap' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Show me how to use commands' })).toBeVisible();
  });

  test('progresses walkthrough steps for help basics', async ({ page }) => {
    await openAskDocsModal(page);

    await page.getByRole('button', { name: 'Show me how: Help commands' }).click();
    await expect(page.getByText('Step 1 of 2')).toBeVisible();
    await expect(page.getByText('Type a Command')).toBeVisible();

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Step 2 of 2')).toBeVisible();
    await expect(page.getByText('Review Help History')).toBeVisible();
  });

  test('routes deep-link search command to export settings', async ({ page }) => {
    await openAskDocsModal(page);
    await submitHelpQuery(page, 'search for export backup');

    await expect(page).toHaveURL(/\/app\/settings#export/);
  });

  test('opens help modal from keyboard shortcut', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('Mobile'), 'Desktop-only shortcut behavior');

    await page.keyboard.press('Control+/');
    await expect(page.getByTestId('ask-docs-modal')).toBeVisible();
  });
});
