import { test, expect } from '@playwright/test';
import { signIn, signOut } from "./steps/login-steps";
import { clickToStaffPage, fillSearchBox } from "./steps/staff-steps";
import axeTest from "./helpers/accessibilityTestHelper";

test('Simplified search results', async ({ page }) => {
    await signIn(page, "STAFF_ADMIN");
    await clickToStaffPage(page);
  
    console.log("Using simple search");
    await fillSearchBox(page);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('exui-staff-user-list')).toContainText('Showing 1');
  
    await signOut(page);
  });

test('Simplified search', async ({ page }) => {
    await signIn(page, "STAFF_ADMIN");
    await clickToStaffPage(page);
  
    console.log("Using Simple search");
    await fillSearchBox(page);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('columnheader', { name: 'Job title' })).toBeVisible();
    await expect(page.locator('exui-staff-user-list')).toContainText('Showing 1');
    await axeTest(page);
  
    await signOut(page);
  });

test('Toggle search', async ({ page }) => {
  await signIn(page, "STAFF_ADMIN");
  await clickToStaffPage(page);

  console.log("Toggle between simple and advanced search");
  await page.locator('#main-content').getByRole('textbox').click();
  await page.locator('#main-content').getByRole('textbox').fill('xui');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'Advanced search' }).click();
  await page.locator('#select_user-job-title').selectOption('2');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Showing')).toBeVisible();
  await page.getByRole('link', { name: 'Hide advanced search' }).click();
  await expect(page.getByText('Showing')).toBeVisible();
  await expect(page.locator('#main-content').getByRole('textbox')).toBeVisible();
  await page.getByText('User search Search for a user').click();
  await page.getByRole('link', { name: 'Advanced search' }).click();
  await expect(page.locator('#select_user-job-title')).toBeVisible();
  await expect(page.getByText('Showing')).toBeVisible();

  await signOut(page);
});

test('Advanced search', async ({ page }) => {
    await signIn(page, "STAFF_ADMIN");
    await clickToStaffPage(page);
  
    console.log("Using user simple search");
    await page.locator('#main-content').getByRole('textbox').click();
    await page.locator('#main-content').getByRole('textbox').fill('xui');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('exui-staff-user-list')).toContainText('Showing 1');
  
    console.log("Using Advanced search");
    await page.getByRole('link', { name: 'Advanced search' }).click();
    await expect(page.getByText('Search for a service by name')).toBeVisible();
    await page.locator('#inputServiceSearch').click();
    await page.locator('#inputServiceSearch').fill('Damages');
    await page.getByRole('option', { name: 'Damages' }).locator('span').click();
    await page.getByRole('link', { name: 'Add service' }).click();
    await page.locator('#inputLocationSearch').click();
    await page.locator('#inputLocationSearch').fill('Bir');
    await page.getByRole('option', { name: 'Birmingham' }).locator('span').click();
    await page.getByRole('link', { name: 'Add location' }).click();
    await page.locator('#select_user-type').selectOption('3');
    await page.getByLabel('Case allocator').check();
    await page.locator('#select_user-job-title').selectOption('2');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('#user-list-no-results')).toContainText('No results found');
  
    await axeTest(page);
    await signOut(page);
  });