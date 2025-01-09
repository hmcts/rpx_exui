import  { retryAction } from './retry-steps';

export async function clickToStaffPage(page) {
  console.log("Going to Staff Page");
  await retryAction(async () => {
    await page.getByRole('link', { name: 'Staff' }).click();
    await page.waitForSelector('text=User list', { state: 'visible', timeout: 1000 });
  });
}

export async function fillSearchBox(page) {
  console.log("Fill SearchBox");
  await retryAction(async () => {
    await page.locator('#main-content').getByRole('textbox').click();
    await page.locator('#main-content').getByRole('textbox').fill('xui');
  });
}