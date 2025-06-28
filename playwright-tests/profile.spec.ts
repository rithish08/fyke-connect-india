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

test.describe('Profile Page', () => {
  test('Login and check Profile page', async ({ page }) => {
    await devLogin(page);
    await page.goto(`${BASE_URL}/profile`);
    // Check for user info (name, phone, etc.)
    const userInfo = page.locator('[class*="profile" i], [data-testid*="profile" i], .user-info');
    await expect(userInfo.first()).toBeVisible();
    // Check for edit button
    const editButton = page.locator('button', { hasText: /edit|update/i });
    await expect(editButton).toBeVisible();
  });
}); 