import { test, expect } from '@playwright/test';

test('should allow a user to log in with a test phone number and OTP', async ({ page }) => {
  // Navigate to the login screen
  // Navigate to the language selection screen
  await page.goto('/language');

  // Click the "English" button
  await page.locator('button:has-text("English")').click();

  // Navigate to the login screen
  await page.goto('/login');

  await page.pause();

  // Wait for the page to load and the input to be visible
  const phoneInput = page.getByPlaceholder('9876543210');
  await page.pause();
  await expect(phoneInput).toBeVisible();

  // Enter the test phone number
  await phoneInput.fill('9999999999');

  // Click the "Send OTP" button
  await page.locator('button:has-text("Send OTP")').click();

  // Wait for the OTP input to appear
  const otpInput = page.locator('input[aria-label="Please enter your one-time password."]');
  await expect(otpInput).toBeVisible();

  // Enter the magic OTP
  await otpInput.fill('123456');

  // After filling the OTP, navigation should happen automatically.
  // We assert that the URL changes to the role selection page.
  await expect(page).toHaveURL('/role-selection', { timeout: 10000 });
});
