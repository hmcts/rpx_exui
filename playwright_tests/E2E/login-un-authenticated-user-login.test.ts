import { test, expect } from '@playwright/test';
import config from "../config"

test('login un-authenticated user login', async ({ page }) => {
  await page.goto(config.CaseBaseURL);
  await page.getByLabel('Email address').fill('test_nonexisting_or_invalid@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Incorrect email or password' })).toBeVisible();
  expect(page.url()).toContain('idam-web-public');
});