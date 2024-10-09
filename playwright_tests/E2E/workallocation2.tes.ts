import { test, expect } from '@playwright/test';
import { signIn, signOut } from "./steps/login-steps";
import axeTest from "./helpers/accessibilityTestHelper";

test('All work tabs', async ({ page }) => {
await signIn(page, "IAC_CaseOfficer_R2", false);

console.log("All work tabs header cheks");
await expect(page.getByText('Use the work filter to show')).toBeVisible();
await expect(page.getByRole('link', { name: 'All work' })).toBeVisible();
await page.getByRole('link', { name: 'All work' }).click();
await expect(page.getByText('View and manage all tasks')).toBeVisible();
await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
await assertTableColumnNames(page, true, false);
});


test('My work tabs', async ({ page }) => {
  await signIn(page, "IAC_CaseOfficer_R2", false);

  console.log("My work columns");
  await expect(page.getByRole('heading', { name: 'My work' })).toBeVisible();
  await expect(page.getByText('Use the work filter to show')).toBeVisible();
  await expect(page.locator('[data-test="search-result-summary__text"]')).toBeVisible();
  await assertTableColumnNames(page, false, true);
  await expect(page.getByRole('link', { name: 'Available tasks' })).toBeVisible();
  await axeTest(page);

  console.log("Available tasks columns");
  await page.getByRole('link', { name: 'Available tasks' }).click();
  await expect(page.locator('[data-test="search-result-summary__text"]')).toBeVisible();
  await assertTableColumnNames(page, false, true);
  await expect(page.getByRole('link', { name: 'My cases' })).toBeVisible();
  await axeTest(page);
  
  console.log("My cases Columns");
  await page.getByRole('link', { name: 'My cases' }).click();
  await expect(page.getByText('Showing 0 results')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Case name' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Service', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Case category' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Case role' })).toBeVisible();
  await expect(page.getByRole('button', { name: '▼ Hearing date ▲' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'End' })).toBeVisible();
  await axeTest(page);
});

test('View tasks, E2E journey of Caseworker-ia-officer user', async ({ page }) => {
  await signIn(page, "IAC_CaseOfficer_R2", false);

  console.log("Check all header tabs");
  console.log("My work tabs");
  await page.getByRole('link', { name: 'My work' }).click();
  await expect(page.getByText('Use the work filter to show')).toBeVisible();
  await checkAllHeadersTabMenu(page);
  
  console.log("All works tabs");
  await page.getByRole('link', { name: 'All work' }).click();
  await expect(page.getByRole('heading', { name: 'All work' })).toBeVisible();
  await checkAllHeadersTabMenu(page);

  console.log("Create case tabs");
  await page.getByRole('link', { name: 'Create case' }).click();
  await expect(page.getByRole('heading', { name: 'Create Case' })).toBeVisible();
  await checkAllHeadersTabMenu(page);

  console.log("Availble task check");
  await page.getByRole('link', { name: 'My work' }).click();
  await expect(page.getByText('Use the work filter to show')).toBeVisible();
  await expect(page.locator('[data-test="search-result-summary__text"]')).toBeVisible();
  await assertTableColumnNames(page, false, true);
  await page.getByRole('button', { name: '▼ Case category ▲' }).click();

  console.log("Case list tabs");
  await page.getByRole('link', { name: 'Case list' }).click();
  await expect(page.getByRole('heading', { name: 'Case list' })).toBeVisible();
  await checkAllHeadersTabMenu(page);
  await axeTest(page);
});

async function checkAllHeadersTabMenu(page) {
  await expect(page.getByRole('link', { name: 'My work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Case list' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'All work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Create case' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
}

async function assertTableColumnNames(page, withPersonChecked: boolean, withHearingDateChecked: boolean) {
  await expect(page.getByRole('button', { name: '▼ Case name ▲' })).toBeVisible();
  await expect(page.getByRole('button', { name: '▼ Case category ▲' })).toBeVisible();
  await expect(page.getByRole('button', { name: '▼ Location ▲' })).toBeVisible();
  await expect(page.getByRole('button', { name: '▼ Task ▲' })).toBeVisible();
  if (withPersonChecked) await expect(page.getByRole('heading', { name: 'Person' })).toBeVisible();
  if (withHearingDateChecked) await expect(page.getByRole('button', { name: '▼ Hearing date ▲' })).toBeVisible();
  await expect(page.getByRole('button', { name: '▼ Due date ▲' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Priority' })).toBeVisible();
  await expect(page.getByRole('button', { name: '▼ Task created ▲' })).not.toBeVisible();
}
