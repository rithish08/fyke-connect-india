import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

const TEST_USERS = [
  { phone: '7777777777', otp: '333333' },
  { phone: '8888888888', otp: '111111' }
];

async function devLogin(page, user) {
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
      await page.fill(selector, user.phone);
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
  await page.fill(otpSelector, user.otp);
  // OTP auto-submits, so wait for either role selection or home page
  try {
    await page.waitForFunction(() => {
      return (
        window.location.pathname.includes('role-selection') ||
        window.location.pathname.includes('home')
      );
    }, { timeout: 20000 });
  } catch (e) {
    console.log('DEBUG: Navigation did not happen after OTP. Current URL:', await page.url());
    console.log('DEBUG: Page content:', await page.content());
    throw e;
  }
}

test.describe('Job Search Page', () => {
  for (const user of TEST_USERS) {
    test(`Login and check Job Search page for ${user.phone}`, async ({ page }) => {
      await devLogin(page, user);
      await page.goto(`${BASE_URL}/search`);
      // Check for search input field
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
      await expect(searchInput).toBeVisible();
      // Check for job result cards or list
      const jobCard = page.locator('[class*="job-card" i], [data-testid*="job" i], .job-list, .job-results');
      await expect(jobCard.first()).toBeVisible();
    });
  }
}); 