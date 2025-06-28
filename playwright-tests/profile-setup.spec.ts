import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

async function devLogin(page) {
  await page.goto(`${BASE_URL}/login`);
  // Wait for splash screen to disappear
  await page.waitForSelector('input[maxlength="10"], input[type="tel"], input[name="phone"], input[placeholder*="phone" i]', { timeout: 20000 });
  
  // Fill phone number
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
  
  // Send OTP
  await page.click('button:has-text("Send OTP")');
  
  // Wait for OTP input and fill with default OTP
  const otpSelector = 'input[type="tel"]:not([maxlength="10"])';
  await page.locator(otpSelector).first().waitFor({ timeout: 10000 });
  await page.fill(otpSelector, '123456');
  
  // OTP auto-submits, so wait for either role selection or home page
  await Promise.race([
    page.waitForURL('**/role-selection', { timeout: 20000 }),
    page.waitForURL('**/home', { timeout: 20000 })
  ]);
}

test.describe('Profile Setup Flow', () => {
  test('Login and check Profile Setup page', async ({ page }) => {
    await devLogin(page);
    await page.goto(`${BASE_URL}/profile-setup`);
    // Check for a heading or form field
    await expect(page.locator('h1, h2, h3')).toContainText([/profile/i, /setup/i]);
    // Example: Check for a name input or next button
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
    await expect(nameInput).toBeVisible();
  });
});
