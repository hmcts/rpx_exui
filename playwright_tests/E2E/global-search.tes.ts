import { test, expect } from '@playwright/test';
import { signIn } from './steps/login-steps';
import { clickOnMainMenu } from './steps/steps-functions';
import { retryAction } from './steps/retry-steps';
import axeTest from "./helpers/accessibilityTestHelper";

test('Search from menu 16-digit find control', async ({ page }) => {
  await signIn(page, 'IAC_CaseOfficer_R2');

  console.log('Search from menu 16-digit find control');
  const caseId = findCaseId(page)
  await expect(page.getByText('-digit case reference:')).toBeVisible();
  await page.getByLabel('-digit case reference:').click();
  await page.getByLabel('-digit case reference:').fill(caseId); 
  await retryAction(async () => {
    await page.locator('//button[contains(text(), "Find")]').click();
    await expect(page.getByRole('heading', { name: 'Current progress of the case' })).toBeVisible();
  });
  await axeTest(page);
  
  console.log('Check the case details are displayed');
  await expect(page.getByRole('heading', { name: 'Current progress of the case' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Do this next' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Case details' })).toBeVisible();
  await expect(page.getByText('Home Office Reference/Case ID')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Legal representative' })).toBeVisible();
});


test('Search from page Search', async ({ page }) => {
  await signIn(page, 'IAC_CaseOfficer_R2');

  console.log('Go to Search Page');
  clickOnMainMenu(page, 'Search', 'Search cases');
  await expect(page.getByRole('heading', { name: 'Search cases' })).toBeVisible();
  await expect(page.locator('span').filter({ hasText: '-digit case reference' })).toBeVisible();
  await expect(page.getByText('Other reference', { exact: true })).toBeVisible();

  console.log('Try Seach button with non existent case id');
  const nonExistentCaseId = '1697034829280945';
  await page.getByLabel('16-digit case reference', { exact: true }).fill(nonExistentCaseId);
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'No results found' })).toBeVisible();
  await axeTest(page);
});

function findCaseId(page: any) {
    if (page.url().includes('aat')) {
      console.log('Use aat case id');
      return '1714721967501327';
    }
    console.log('Use demo case id');
    return '1662020492250902';
}