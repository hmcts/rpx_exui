import { expect } from '@playwright/test';

export async function confirmNextSteps(page, responseBody) {
  const eventTriggerOptions = page.getByLabel('Next step');
  const responseOptions = responseBody.map((item) => item.name);
  const options = await eventTriggerOptions.locator('option').allTextContents();
  responseOptions.forEach((element) => {
    if (options.indexOf(element) === -1){
      return false;
    }
  });
  return true;
}

export async function confirmTabsVisible(page, responseBody) {
  const tabLabels = page.locator('.mat-tab-list .mat-tab-labels .mat-tab-label');
  const responseTabsSet = new Set(responseBody.map((tab) => tab.label));
  const count = await tabLabels.count();
  const pageTabs = await Promise.all(
    Array.from({ length: count }, (_, i) => tabLabels.nth(i).innerText())
  );
  return Array.from(responseTabsSet).every((tab) => pageTabs.includes(tab));
}

async function getKeyVal(field: any): Promise < string > {
  return field.value;
}

export async function caseDetailsCheck(page, apiResponse) {
  const caseDetailsTabs = page.locator('mat-tab-body table tbody > div > tbody');

  const tabHeaders = page.locator('mat-tab-header .mat-tab-label');
  const numberOfTabs = await tabHeaders.count();

  for (let tabIndex = 0; tabIndex < numberOfTabs; tabIndex++) {
    const tabHeader = tabHeaders.nth(tabIndex);
    const tabName = (await tabHeader.innerText()).trim();

    await tabHeader.click();

    await page.waitForTimeout(1000);

    const fieldCount = await caseDetailsTabs.count();

    const tabData = apiResponse.tabs.find((tab: any) => tab.label === tabName);
    if (!tabData) {
      throw new Error(`Tab with label "${tabName}" not found in API response.`);
    }

    for (let fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
      const complexFieldTable = caseDetailsTabs.nth(fieldIndex).locator('xpath=./*');

      const thCF = complexFieldTable.locator('tr th');
      const tdCF = complexFieldTable.locator('tr td');

      const webTableLabel = (await thCF.first().innerText()).trim();
      const value = (await tdCF.first().innerText()).trim();

      const fieldData = tabData.fields.find((field: any) => field.label === webTableLabel);
      if (!fieldData) {
        throw new Error(`Field with label "${webTableLabel}" not found in API response for tab "${tabName}".`);
      }

      if (fieldData.value && value && fieldData.value.length > 0) {
        const resKeyVal = await getKeyVal(fieldData);
        const fieldStatus = resKeyVal === value && fieldData.label === webTableLabel;
        expect(fieldStatus, `"${resKeyVal}" is not present in the web for field "${webTableLabel}".`).toBe(true);
      } else {
        const fieldLabelStatus = fieldData.label === webTableLabel;
        expect(fieldLabelStatus, `Field label "${fieldData.label}" is not present in the web as "${webTableLabel}".`).toBe(true);
      }
    }
  }
}

export async function validateWorkBasketComplexValues(page, response){
  response.forEach((input) => {
    complexFieldVal(page, input);
  });
}

async function complexFieldVal(page, WBField) {
  switch (WBField.field_type?.type) {
    case 'FixedRadioList':

      const radioLabels = page.locator('.multiple-choice label');

      await expect(radioLabels).toBeVisible({ timeout: 5000 });

      const APIResList = WBField.field_type.fixed_list_items.map((item) => item.label);

      const webResList = [];
      const count = await radioLabels.count();

      for (let i = 0; i < count; i++) {
        const labelText = await radioLabels.nth(i).innerText();
        webResList.push(labelText.trim());
      }

      const sortedAPIResList = APIResList.slice().sort();
      const sortedWebResList = webResList.slice().sort();

      await expect(sortedAPIResList, 'API labels do not match web labels').toEqual(sortedWebResList);
      break;
  }
}

export async function validateWorkbasketInputs(page, reqBody) {
  const workBasketFields = reqBody;
  if (workBasketFields) {
    for (const element of workBasketFields) {
      const field = element;
      const fieldId = field.field.id;

      const fieldLocator = page.locator(`#${fieldId}`);
      await expect(fieldLocator).toBeVisible();
    }
  }
}
