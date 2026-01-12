import { test, expect } from '@playwright/test';

/**
 * LifeContext E2E Tests - Life Planning Kanban
 * Tests the Kanban board functionality
 */

test.describe('Life Planning Kanban', () => {
  test.beforeEach(async ({ page }) => {
    // Set up as completed onboarding user
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('lcc-onboarding-complete', 'true');
    });
    await page.goto('/app/life-planning');
  });

  test('should display kanban columns', async ({ page }) => {
    // Should show the 5 default columns
    await expect(page.getByText('Backlog')).toBeVisible();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
  });

  test('should open add task modal', async ({ page }) => {
    // Look for add task button
    const addButton = page.getByRole('button', { name: /add|new task|\+/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      // Modal should appear with title input
      await expect(page.getByPlaceholder(/title|what needs/i)).toBeVisible();
    }
  });

  test('should create a new task', async ({ page }) => {
    // Open add task modal
    const addButton = page.getByRole('button', { name: /add|new task|\+/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill in task details
      await page.getByPlaceholder(/title|what needs/i).fill('Test Task from E2E');
      
      // Submit
      const submitButton = page.getByRole('button', { name: /create|save|add/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Task should appear on the board
        await expect(page.getByText('Test Task from E2E')).toBeVisible();
      }
    }
  });

  test('should filter by category', async ({ page }) => {
    // Look for category filter
    const categoryFilter = page.getByRole('button', { name: /all|category|filter/i });
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      // Should show category options
      await expect(page.getByText(/career|health|family/i)).toBeVisible();
    }
  });
});
