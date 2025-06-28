import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('Login Flow', () => {
  test('Navigate to Login and check for phone input and OTP button', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Check for phone input field (10-digit phone)
    const phoneInput = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone" i], input[maxlength="10"]');
    await expect(phoneInput).toBeVisible();
    // Check for OTP send button
    const otpButton = page.locator('button', { hasText: /otp|send|verify|continue/i });
    await expect(otpButton).toBeVisible();
  });
}); 