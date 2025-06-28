import { test, expect } from '@playwright/test';

// Update this URL if your dev server runs on a different port
const BASE_URL = 'http://localhost:8080';

test.describe('Fyke Connect India App - Smoke Test', () => {
  test('Homepage should load and display expected content', async ({ page }) => {
    await page.goto(BASE_URL);
    // Example: Check for a visible element or text on the homepage
    await expect(page).toHaveTitle(/Fyke|Connect|India/i);
    // You can add more checks here, e.g. logo, header, etc.
  });
}); 