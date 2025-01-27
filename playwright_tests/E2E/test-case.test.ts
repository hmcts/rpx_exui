import { test, expect } from '@playwright/test';
import { signIn, signOut } from './steps/login-steps';
import { waitForSpinner } from './steps/spinner-steps';
import { getCaseReferenceFromFirstRow, dealWithShortenedCaseRefLabel } from './steps/table-steps';
import { confirmNextSteps, confirmTabsVisible, caseDetailsCheck, validateWorkBasketComplexValues, validateWorkbasketInputs } from './steps/test-case';
import { waitForSpecificResponse } from './helpers/responseListenerHelper';
import { createCase } from './steps/create-xui-case-poc-steps';

test('Validate next steps drop down', async ({ page }) => {
  const response = waitForSpecificResponse(
    page,
    'data/internal/cases/',
    'GET'
  );

  await signIn(page, 'SOLICITOR');
  await expect(page.getByLabel('Manage Cases')).toBeVisible();
  await page.getByLabel('Case type').selectOption({ label: 'XUI Case PoC' });
  await page.getByLabel('Apply filter').click();
  await waitForSpinner(page);
  await expect(page.getByRole('heading', { name: 'Your cases' })).toBeVisible();
  let firstCaseRef = await getCaseReferenceFromFirstRow(page);
  if (firstCaseRef.trim().length === 0) {
    await createCase(page);
    firstCaseRef = await getCaseReferenceFromFirstRow(page);
  }
  await page.getByLabel(`go to case with Case reference:${dealWithShortenedCaseRefLabel(firstCaseRef)}`).click();
  const responseData = await response;
  const expectedData = responseData?.triggers;
  const nextStepsMatch = await confirmNextSteps(page, expectedData);
  expect(nextStepsMatch).toBeTruthy();
  await signOut(page);
});

test('Validate tabs are visible', async ({ page }) => {
  const response = waitForSpecificResponse(
    page,
    'data/internal/cases/',
    'GET'
  );

  await signIn(page, 'SOLICITOR');
  await expect(page.getByLabel('Manage Cases')).toBeVisible();
  await page.getByLabel('Case type').selectOption({ label: 'XUI Case PoC' });
  await page.getByLabel('Apply filter').click();
  await waitForSpinner(page);
  await expect(page.getByRole('heading', { name: 'Your cases' })).toBeVisible();
  let firstCaseRef = await getCaseReferenceFromFirstRow(page);
  if (firstCaseRef.trim().length === 0) {
    await createCase(page);
    firstCaseRef = await getCaseReferenceFromFirstRow(page);
  }
  await page.getByLabel(`go to case with Case reference:${dealWithShortenedCaseRefLabel(firstCaseRef)}`).click();
  const responseData = await response;
  const expectedData = responseData?.tabs;
  const tabsMatch = await confirmTabsVisible(page, expectedData);
  expect(tabsMatch).toBeTruthy();
  await signOut(page);
});

test('Validate tabs details', async ({ page }) => {
  const response = waitForSpecificResponse(
    page,
    'data/internal/cases/',
    'GET'
  );

  await signIn(page, 'SOLICITOR');
  await expect(page.getByLabel('Manage Cases')).toBeVisible();
  await page.getByLabel('Case type').selectOption({ label: 'XUI Case PoC' });
  await page.getByLabel('Apply filter').click();
  await waitForSpinner(page);
  await expect(page.getByRole('heading', { name: 'Your cases' })).toBeVisible();
  let firstCaseRef = await getCaseReferenceFromFirstRow(page);
  if (firstCaseRef.trim().length === 0) {
    await createCase(page);
    firstCaseRef = await getCaseReferenceFromFirstRow(page);
  }
  await page.getByLabel(`go to case with Case reference:${dealWithShortenedCaseRefLabel(firstCaseRef)}`).click();
  const responseData = await response;
  const expectedData = responseData;
  await caseDetailsCheck(page, expectedData);
  await signOut(page);
});

test('Validate workbasket inputs against the API response', async ({ page }) => {
  const response = waitForSpecificResponse(
    page,
    'data/internal/case-types/xuiTestCaseType_dev/',
    'GET'
  );

  await signIn(page, 'SOLICITOR');
  await expect(page.getByLabel('Manage Cases')).toBeVisible();
  await page.getByLabel('Case type').selectOption({ label: 'XUI Test Case type dev' });
  await page.getByLabel('State').selectOption({ label: 'Case created' });

  await page.getByLabel('Apply filter').click();
  await waitForSpinner(page);
  await expect(page.getByRole('heading', { name: 'Your cases' })).toBeVisible();
  const responseData = await response;
  const workBasketData = responseData.workbasketInputs;
  validateWorkbasketInputs(page, workBasketData);
  await signOut(page);
});

test('Validate workbasket complex values against the API response', async ({ page }) => {
  const response = waitForSpecificResponse(
    page,
    'data/internal/case-types/xuiTestCaseType_dev/',
    'GET'
  );

  await signIn(page, 'SOLICITOR');
  await expect(page.getByLabel('Manage Cases')).toBeVisible();
  await page.getByLabel('Case type').selectOption({ label: 'XUI Test Case type dev' });
  await page.getByLabel('State').selectOption({ label: 'Case created' });
  await page.getByLabel('Apply filter').click();
  await waitForSpinner(page);
  await expect(page.getByRole('heading', { name: 'Your cases' })).toBeVisible();
  const responseData = await response;
  const workBasketData = responseData.workbasketInputs;
  validateWorkBasketComplexValues(page, workBasketData);
  await signOut(page);
});

