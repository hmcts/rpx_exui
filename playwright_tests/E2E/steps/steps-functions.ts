export async function clickOnMainMenu(page: any, menuName: string, waitForSelector: string) {
    console.log("Going to "+menuName+" Page");
    const numberOfTrials = 5;
    for (let i = 0; i < numberOfTrials; i++) {
      try {
        await page.getByRole('link', { name: menuName }).click();
        await page.waitForSelector('text='+waitForSelector, { state: 'visible', timeout: 1000 });
        break;
      } catch (error) {
        console.log('Click to '+menuName+' page failed, retrying (${i + 1}/${numberOfTrials})...');
        if (i !== numberOfTrials) await page.waitForTimeout(1000); // Wait 1 second before the next attempt
        else throw error;
      }
    }
  }