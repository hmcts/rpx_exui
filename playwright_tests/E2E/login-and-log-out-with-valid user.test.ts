import { test, expect } from '@playwright/test';
import config from "../config"
const testConfig = require('../../test_codecept/e2e/config/appTestConfig');

test('login and log out from EUI with valid user', async ({ page }) => {
  const matchingUsers = testConfig.users[testConfig.testEnv].filter((user) => user.userIdentifier === 'PROD_LIKE');
  await page.goto(config.CaseBaseURL);
  await expect(page.getByRole('heading', { name: 'Sign in or create an account' })).toBeVisible();  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill(matchingUsers[0].email);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(matchingUsers[0].key);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Case list' })).toBeVisible();
  await page.getByText('Sign out').click();
  await expect(page.getByRole('heading', { name: 'Sign in or create an account' })).toBeVisible();
});