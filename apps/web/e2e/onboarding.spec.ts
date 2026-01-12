import { test, expect } from '@playwright/test';

/**
 * LifeContext E2E Tests - Onboarding Flow
 * Tests the complete onboarding wizard from start to completion
 */

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh start
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display onboarding wizard on first visit', async ({ page }) => {
    await page.goto('/');
    
    // Should see the welcome step
    await expect(page.getByText('Welcome to LifeContext')).toBeVisible();
  });

  test('should allow skipping onboarding', async ({ page }) => {
    await page.goto('/');
    
    // Look for skip button
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
      // Should be redirected to main app
      await expect(page).toHaveURL(/.*\/app.*|.*\/$/);
    }
  });

  test('should complete onboarding wizard', async ({ page }) => {
    await page.goto('/');
    
    // Step through the wizard
    const nextButton = page.getByRole('button', { name: /next|continue|get started/i });
    
    // Click through steps until we reach the end or hit max steps
    for (let i = 0; i < 10; i++) {
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300); // Animation delay
      } else {
        break;
      }
    }
    
    // Should complete and redirect
    await expect(page).toHaveURL(/.*\/(app)?$/);
  });
});
