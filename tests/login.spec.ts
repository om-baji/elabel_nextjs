import { test, expect } from '@playwright/test';

test('Login page shows all fields and allows switching tabs', async ({ page }) => {
  await page.goto('/login'); // Use relative path, baseURL is set in config

  // Check for Email field
  await expect(page.getByLabel('Email')).toBeVisible();

  // Switch to Magic Link tab
  await page.getByRole('tab', { name: /Magic Link/i }).click();
  await expect(page.getByLabel('Email')).toBeVisible();

  // Switch to Log In tab
  await page.getByRole('tab', { name: /Log In/i }).click();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});
