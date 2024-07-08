import { expect } from '@playwright/test';

export async function checkTableCellContent(page, tableName: string, rowId: number, colID: number, expectedText: string) {
    const row = await page.locator(`table.govuk-table:has-text("${tableName}")`).locator('tr').nth(rowId);
    const text = await row.locator('td').nth(colID).innerText();
    await expect(text).toBe(expectedText);
    console.log(tableName+"["+rowId+","+colID+"]"+ text);
}
  
export async function checkTableRowContent(page, tableClass: string, tableName: string, rowTextRef: string, textsToCheck: RegExp[]) {
    const respondantTable = page.locator(`.${tableClass}:has-text("${tableName}")`);
    await expect(respondantTable.locator('td', { hasText: `${rowTextRef}` })).toBeVisible(); 
    const rowToCheck = respondantTable.locator(`tr:has-text("${rowTextRef}")`);
    for (const text of textsToCheck) {
      await expect(rowToCheck).toHaveText(text);
    }
}

export async function checkNumberOfRow(page, tableClass: string, tableName: string, expectedRowCount: number) {
    const respondantTable = page.locator(`.${tableClass}:has-text("${tableName}")`);
    const rowCount = await respondantTable.locator('tr').count();
    await expect(rowCount).toBe(expectedRowCount);
}