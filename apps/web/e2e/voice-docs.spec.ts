import { expect, test } from '@playwright/test';

test.describe('Voice Docs Assistant', () => {
  test('opens assistant and returns a response with context-aware suggestions', async ({ page }) => {
    await page.goto('/help');

    await page.getByTestId('ask-docs-toggle').click();
    await expect(page.getByText('Context: default')).toBeVisible();
    await expect(page.getByRole('button', { name: 'How do I lock?' })).toBeVisible();

    await page.getByPlaceholder('Type your question...').fill('How do I export my data?');
    await page.getByTestId('ask-docs-send').click();

    await expect(page.getByText('Ask another question')).toBeVisible();
  });
});
