import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

const TEST_USERS = [
  { phone: '7777777777', otp: '333333' },
  { phone: '8888888888', otp: '111111' }
];

test.describe('Login Flow', () => {
  for (const user of TEST_USERS) {
    test(`Login with phone ${user.phone}`, async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      // Check for phone input field (10-digit phone)
      const phoneInput = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone" i], input[maxlength="10"]');
      await expect(phoneInput).toBeVisible();
      await phoneInput.fill(user.phone);
      // Check for OTP send button
      const otpButton = page.locator('button', { hasText: /otp|send|verify|continue/i });
      await expect(otpButton).toBeVisible();
      await otpButton.click();
      // Debug: print page content after clicking Send OTP
      console.log('DEBUG: After clicking Send OTP. Page content:');
      console.log(await page.content());
      // Wait for OTP input and fill
      const otpInput = page.locator('input[type="tel"]:not([maxlength="10"])');
      await otpInput.first().waitFor({ timeout: 10000 });
      await otpInput.fill(user.otp);
      // Wait for navigation to next step (role selection or home), or print debug info if it fails
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
    });
  }
}); 