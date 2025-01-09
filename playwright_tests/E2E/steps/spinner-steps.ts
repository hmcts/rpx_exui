import { Page } from '@playwright/test';

export async function waitForSpinner(page: Page) {
  try {
    await page.waitForSelector('xuilib-loading-spinner', { state: 'attached', timeout: 5000 });
    await page.waitForSelector('xuilib-loading-spinner', { state: 'detached' });
  } catch (error) {
    console.log('Spinner did not appear within the timeout period.');
  }
}
