import { test, expect } from '@playwright/test';

/**
 * LifeContext E2E Tests - Data Reclamation
 * Tests the data reclamation feature pages
 */

test.describe('Data Reclamation', () => {
  test('should display marketing page', async ({ page }) => {
    await page.goto('/data-reclamation-info');
    
    // Should show hero content
    await expect(page.getByText(/data.*out there|reclaim/i)).toBeVisible();
  });

  test('should show GDPR platforms', async ({ page }) => {
    await page.goto('/data-reclamation-info');
    
    // Should show platform list
    await expect(page.getByText(/google|meta|amazon/i)).toBeVisible();
  });

  test('should show data broker section', async ({ page }) => {
    await page.goto('/data-reclamation-info');
    
    // Should show broker information
    await expect(page.getByText(/broker|spokeo|whitepages/i)).toBeVisible();
  });

  test('should navigate to data reclamation app page', async ({ page }) => {
    // Set up as completed onboarding user
    await page.evaluate(() => {
      localStorage.setItem('lcc-onboarding-complete', 'true');
    });
    await page.goto('/app/data-reclamation');
    
    // Should show consent form
    await expect(page.getByText(/consent|understand|agree/i)).toBeVisible();
  });
});
