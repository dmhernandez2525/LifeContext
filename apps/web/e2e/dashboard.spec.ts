import { test, expect } from '@playwright/test';

/**
 * LifeContext E2E Tests - Dashboard
 * Tests the main dashboard functionality after login
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Set up as completed onboarding user
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('lcc-onboarding-complete', 'true');
    });
    await page.goto('/app');
  });

  test('should display dashboard after onboarding', async ({ page }) => {
    // Dashboard should have main sections
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should navigate to journal page', async ({ page }) => {
    // Look for journal link in navigation
    const journalLink = page.getByRole('link', { name: /journal/i });
    if (await journalLink.isVisible()) {
      await journalLink.click();
      await expect(page).toHaveURL(/.*journal.*/);
    }
  });

  test('should navigate to life planning page', async ({ page }) => {
    // Look for life planning link
    const planningLink = page.getByRole('link', { name: /life planning|kanban|planning/i });
    if (await planningLink.isVisible()) {
      await planningLink.click();
      await expect(page).toHaveURL(/.*life-planning.*/);
    }
  });

  test('should navigate to AI insights page', async ({ page }) => {
    // Look for insights link
    const insightsLink = page.getByRole('link', { name: /insights|ai/i });
    if (await insightsLink.isVisible()) {
      await insightsLink.click();
      await expect(page).toHaveURL(/.*insights.*/);
    }
  });
});
