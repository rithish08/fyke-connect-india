import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

const TEST_USERS = [
  { phone: '7777777777', otp: '333333' },
  { phone: '8888888888', otp: '111111' }
];

test.describe('Login Flow', () => {
  for (const user of TEST_USERS) {
    test(`Login with phone ${user.phone}`, async ({ page }) => {
      // Go to login page
      await page.goto(`${BASE_URL}/login`);
      
      // Fill phone number
      const phoneInput = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone" i], input[maxlength="10"]');
      await expect(phoneInput).toBeVisible();
      await phoneInput.fill(user.phone);
      
      // Click Send OTP button
      const otpButton = page.locator('button', { hasText: /otp|send|verify|continue/i });
      await expect(otpButton).toBeVisible();
      await otpButton.click();
      
      // Wait for OTP screen to appear
      await page.waitForSelector('text=Verify Your Phone', { timeout: 10000 });
      
      // Fill OTP inputs - Enhanced OTP Input uses individual input fields
      const otpInputs = page.locator('input[type="text"][maxlength="1"]');
      await expect(otpInputs.first()).toBeVisible({ timeout: 5000 });
      
      // Fill each OTP digit individually
      for (let i = 0; i < user.otp.length; i++) {
        await otpInputs.nth(i).fill(user.otp[i]);
      }
      
      // Wait for auto-verification or navigation
      try {
        await page.waitForFunction(() => {
          return (
            window.location.pathname === '/' ||
            window.location.pathname.includes('role-selection') ||
            window.location.pathname.includes('home') ||
            window.location.pathname.includes('profile-setup')
          );
        }, { timeout: 30000 });
        
        console.log(`✅ Login successful for ${user.phone}. Current URL: ${await page.url()}`);
      } catch (e) {
        console.log('❌ Navigation timeout after OTP verification');
        console.log('Current URL:', await page.url());
        console.log('Page title:', await page.title());
        throw e;
      }
    });
  }
});