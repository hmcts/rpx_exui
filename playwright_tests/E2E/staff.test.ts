import { test, expect } from "@playwright/test";
import { signIn, signOut } from "./steps/login-steps";
import { clickToStaffPage } from "./steps/staff-steps";


test("staff user details", async ({ page }) => {
  await signIn(page, "STAFF_ADMIN");
  await clickToStaffPage(page);

  console.log("Using user simple search");
  await page.locator("#main-content").getByRole("textbox").click();
  await page.locator("#main-content").getByRole("textbox").fill("xui");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "xui caseworker all services" })
  ).toBeVisible();
  await page.getByRole("link", { name: "xui caseworker all services" }).click();
  await expect(
    page.getByRole("heading", { name: "User details" })
  ).toBeVisible();
  await expect(page.getByText("Name")).toBeVisible();
  await expect(page.getByText("Email address")).toBeVisible();
  await expect(page.getByText("Service", { exact: true })).toBeVisible();
  await expect(page.getByText("User type")).toBeVisible();
  await expect(page.getByText("Status")).toBeVisible();
  expect(page.locator("dl")).toContainText("xui caseworker all services");
  await expect(page.locator("dl")).toContainText("Legal office");

  await signOut(page);
});

test('Add new user work flow - back, cancel and change', async ({ page }) => {
  await signIn(page, "STAFF_ADMIN");
  await clickToStaffPage(page);

  console.log("Adding new user then cancel");
  await page.getByRole('button', { name: 'Add new user' }).click();
  await expect(page.getByRole('heading', { name: 'Add user' })).toBeVisible();
  await page.locator('#first_name').click();
  await page.locator('#first_name').fill('firstName1');
  await page.locator('#last_name').click();
  await page.locator('#last_name').fill('LastName1');
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  
  console.log("Adding new user with missing fields");
  await expect(page.getByRole('heading', { name: 'Add user' })).toBeVisible();
  await page.locator('#first_name').click();
  await page.locator('#first_name').fill('firstName1');
  await page.locator('#last_name').click();
  await page.locator('#last_name').fill('LastName1');
  await page.locator('#email_id').click();
  await page.locator('#email_id').fill('firstName1LastName1test@justice.co.uk');
  await page.locator('#region_id').selectOption('1');
  await page.getByLabel('Specified Money Claims').check();
  await page.getByLabel('Damages').check();
  await page.getByLabel('Family Public Law').check();
  await page.getByLabel('Family Private Law').check();
  await page.getByLabel('Criminal Injuries Compensation').check();
  await page.getByLabel('Enter a location name').click();
  await page.getByLabel('Enter a location name').fill('Lo');
  await page.getByText('East London').click();
  await page.getByRole('link', { name: 'Add primary location' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log("Check for missing fields error messages, correct them, then cancel");
  await expect(page.getByRole('link', { name: 'Select a user type' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Select at least one job title' })).toBeVisible();
  await page.locator('#user_type').selectOption('Legal office');
  await page.getByLabel('CICA Caseworker').check();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  console.log("Adding new user");
  await expect(page.getByRole('button', { name: 'Add new user' })).toBeVisible();
  await page.getByRole('button', { name: 'Add new user' }).click();
  await page.locator('#first_name').click();
  await page.locator('#first_name').fill('FirstName');
  await page.locator('#last_name').click();
  await page.locator('#last_name').fill('LastNema');
  await page.locator('#email_id').click();
  await page.locator('#email_id').fill('bablbabla178y98test@justice.co.uk');
  await page.locator('#region_id').selectOption('1');
  await page.getByLabel('Specified Money Claims').check();
  await page.getByLabel('Damages').check();
  await page.getByLabel('Family Public Law').check();
  await page.getByLabel('Family Private Law').check();
  await page.getByLabel('Enter a location name').click();
  await page.getByLabel('Enter a location name').fill('Lon');
  await page.getByText('East London').click();
  await page.locator('#user_type').selectOption('Legal office');
  await page.getByLabel('Case allocator').check();
  await page.getByLabel('Case allocator').uncheck();
  await page.getByLabel('CICA Caseworker').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Add primary location' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  console.log("Check summary page, update name and email, then cancel");
  await page.getByRole('link', { name: 'Change name' }).click();
  await page.locator('#first_name').fill('FirstName2');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Change email' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'User search' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add new user' })).toBeVisible();

  await signOut(page);
});
