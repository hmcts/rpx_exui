import { test, expect } from '@playwright/test';
import { signIn } from "./steps/login-steps"
import config from "../config"
import axeTest from "./helpers/accessibilityTestHelper";

test('login and log out from EUI with valid user', async ({ page }) => {
  await signIn(page, 'PROD_LIKE');
  await expect(page.getByRole('heading', { name: 'Case list' })).toBeVisible();
  await page.getByText('Sign out').click();
  await expect(page.getByRole('heading', { name: 'Sign in or create an account' })).toBeVisible();
  await axeTest(page);
});

test('login Verify the direct link navigate to login page', async ({ page }) => {
    await page.goto(config.CaseBaseURL);
    await expect(page.getByRole('heading', { name: 'Sign in or create an account' })).toBeVisible();
    await expect(page.url()).toContain('idam-web-public');
    await axeTest(page);
  });

  test('login un-authenticated user login', async ({ page }) => {
    await page.goto(config.CaseBaseURL);
    await page.getByLabel('Email address').fill('test_nonexisting_or_invalid@gmail.com');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Incorrect email or password' })).toBeVisible();
    await expect(page.url()).toContain('idam-web-public');
    await axeTest(page);
  });

