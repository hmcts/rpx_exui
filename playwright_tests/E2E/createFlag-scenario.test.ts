import { test, expect } from '@playwright/test';
import config from '../config'
import { signIn } from './steps/login-steps';
import axeTest from "./helpers/accessibilityTestHelper";

test('Create case flag Add/Update Reasonable adjustment', async ({ page }) => {
  await signIn(page, "USER_WITH_FLAGS");
  await expect(page.getByRole('heading', { name: 'Case list' })).toBeVisible();

  const xuiCaseFlagV1Url = config.CaseBaseURL + '/case-create/DIVORCE/xuiCaseFlagsV1/createCase/createCasetestDataSetup';
  console.log("Going to test data setup url" + xuiCaseFlagV1Url);
  await page.goto(xuiCaseFlagV1Url);
  await expect(page.getByRole('heading', { name: 'Test data setup' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Flags for legal rep Party 1 (' })).toBeVisible();

  console.log("Adding new case");
  await page.getByRole('group', { name: 'Flags for legal rep Party 1 (' }).getByLabel('Role On Case (Optional)').click();
  await page.getByRole('group', { name: 'Flags for legal rep Party 1 (' }).getByLabel('Role On Case (Optional)').fill('Party 1');
  await page.getByRole('group', { name: 'Flags for legal rep Party 1 (' }).getByLabel('Party Name (Optional)').click();
  await page.getByRole('group', { name: 'Flags for legal rep Party 1 (' }).getByLabel('Party Name (Optional)').fill('Applicant');
  await page.getByRole('group', { name: 'Flags for legal rep Party 2 (' }).getByLabel('Role On Case (Optional)').click();
  await page.getByRole('group', { name: 'Flags for legal rep Party 2 (' }).getByLabel('Role On Case (Optional)').fill('Party 2');
  await page.getByRole('group', { name: 'Flags for legal rep Party 2 (' }).getByLabel('Party Name (Optional)').click();
  await page.getByRole('group', { name: 'Flags for legal rep Party 2 (' }).getByLabel('Party Name (Optional)').fill('Respondent');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Create a case' })).toBeVisible();
  await page.getByRole('button', { name: 'Test submit' }).click();

  await expect(page.getByText('Flags for legal rep Party 1')).toBeVisible();
  const heading = await page.$('h1.heading-h1.ng-star-inserted');
  const text = await heading.textContent();
  const caseId = text.startsWith('#') ? text.slice(1) : "none";
  console.log("Case created with ID: " + caseId);
  await axeTest(page);

  console.log("Creating case flag");
  await expect(page.getByText('Party 1', { exact: true })).toBeVisible();
  await page.getByText('Case flags', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Case flags' })).toBeVisible();
  await page.getByText('Support', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Support requested' })).toBeVisible();
  await expect(page.getByText('Test data', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Test data' }).click();
  await page.getByLabel('Next step').selectOption('1: Object');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.getByText(caseId)).toBeVisible();
  await axeTest(page);

  console.log("Where should flag be created?");
  await expect(page.getByRole('heading', { name: 'Where should this flag be added?' })).toBeVisible();
  await expect(page.getByText('Applicant (Party 1)')).toBeVisible();
  await expect(page.getByText('Respondent (Party 2)')).toBeVisible();
  await page.getByLabel('Applicant (Party 1)').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await axeTest(page);

  console.log("Select flag type");
  await expect(page.getByRole('heading', { name: 'Select flag type' })).toBeVisible();
  await expect(page.getByText('Reasonable adjustment')).toBeVisible();
  await page.getByLabel('Reasonable adjustment').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText(caseId)).toBeVisible();
  await axeTest(page);

  console.log("Reasonable adjustment");
  await expect(page.getByRole('heading', { name: 'Reasonable adjustment' })).toBeVisible();
  await page.getByLabel('I need documents in an').check();
  await expect(page.getByText('I need adjustments to get to')).toBeVisible();
  await expect(page.getByText('I need to bring support with')).toBeVisible();
  await expect(page.getByText('I need something to feel')).toBeVisible();
  await expect(page.getByText('I need to request a certain')).toBeVisible();
  await expect(page.getByText('I need help communicating and')).toBeVisible();
  await expect(page.getByText('Other')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'I need documents in an' })).toBeVisible();
  await expect(page.getByText('Documents in a specified')).toBeVisible();
  await page.getByLabel('Documents in a specified').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await axeTest(page);

  console.log("Add comments for this flag");
  await expect(page.getByText('Add comments for this flag')).toBeVisible();
  await page.getByLabel('Add comments for this flag').click();
  await page.getByLabel('Add comments for this flag').fill('Test auto comment');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText(caseId)).toBeVisible();
  await axeTest(page);

  console.log("Review flag details");
  await expect(page.getByRole('heading', { name: 'Review flag details' })).toBeVisible();
  await expect(page.getByRole('cell').getByText('Applicant')).toBeVisible();
  await expect(page.getByText('Documents in a specified')).toBeVisible();
  await expect(page.getByText('Test auto comment')).toBeVisible();
  await expect(page.getByText('Active')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change party name' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change flag type' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change comments' })).toBeVisible();
  await expect(page.locator('ccd-case-flag-summary-list div').filter({ hasText: 'Active' }).getByRole('definition').nth(1)).toBeVisible();

  console.log("Submit support request");
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('cut-alert')).toContainText('has been updated with event: Create case flag');
  await expect(page.getByText(caseId+" has been updated")).toBeVisible();
  await page.getByText('Case flags', { exact: true }).click();
  await expect(page.getByRole('table', { name: 'Applicant' }).getByRole('caption')).toBeVisible();
  await expect(page.getByRole('table', { name: 'Respondent' }).getByRole('caption')).toBeVisible();
  await page.waitForSelector('ccd-case-full-access-view');
  await axeTest(page);
});
