import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

async function devLogin(page) {
  await page.goto(`${BASE_URL}/login`);
  // Wait for splash screen to disappear (wait for #root to NOT contain .SplashScreen or for login input to appear)
  await page.waitForSelector('input[maxlength="10"], input[type="tel"], input[name="phone"], input[placeholder*="phone" i]', { timeout: 20000 });
  // Try several selectors for the phone input
  const phoneSelectors = [
    'input[maxlength="10"]',
    'input[type="tel"]',
    'input[name="phone"]',
    'input[placeholder*="phone" i]'
  ];
  let found = false;
  for (const selector of phoneSelectors) {
    if (await page.locator(selector).first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.fill(selector, '1234567890');
      found = true;
      break;
    }
  }
  if (!found) {
    console.log('Phone input not found. Page content:');
    console.log(await page.content());
    throw new Error('Phone input not found on login page');
  }
  await page.click('button:has-text("Send OTP")');
  // Wait for OTP input (6 digits)
  const otpSelector = 'input[type="tel"]:not([maxlength="10"])';
  await page.locator(otpSelector).first().waitFor({ timeout: 10000 });
  await page.fill(otpSelector, '123456');
  await page.click('button:has-text("Verify")');
  await page.waitForURL('**/role-selection', { timeout: 15000 });
}

test.describe('Job Search Page', () => {
  test('Login and check Job Search page', async ({ page }) => {
    await devLogin(page);
    await page.goto(`${BASE_URL}/search`);
    // Check for search input field
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();
    // Check for job result cards or list
    const jobCard = page.locator('[class*="job-card" i], [data-testid*="job" i], .job-list, .job-results');
    await expect(jobCard.first()).toBeVisible();
  });
}); 