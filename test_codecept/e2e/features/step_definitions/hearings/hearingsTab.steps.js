const moment = require('moment')
const hearingsTabPage = require('../../pageObjects/hearings/hearingsTabPage')


Then('I am on hearings tab page', async function () {
    expect(await hearingsTabPage.isDisplayed()).to.be.true
});


Then('I see hearings table for {string} in hearings tab page', async function (hearingsTable) {
    expect(await hearingsTabPage.getTableObject(hearingsTable).isDisplayed()).to.be.true
});


Then('I see hearing {string} in hearings {string} in hearings tab page', async function (hearingType, hearingsTable) {
    expect(await hearingsTabPage.getTableObject(hearingsTable)
        .isHearingDisplayed(hearingType)
    ).to.be.true
});



Then('In hearings tab, I see hearing {string} with values under {string}', async function (hearingName, hearingsTable, datatable) {
    const hearings = datatable.parse().hashes();
    const hearingsTableObj = hearingsTabPage.getTableObject(hearingsTable)

    for (const hearing of hearings) {
        const columns = Object.keys(hearing)
        for (const column of columns) {
            const actualValue = await hearingsTableObj.getHearingTypeColumnValue(hearingName, column)
            if (column === "Actions") {
                const expectedValues = hearing[column].split(',')
                for (const expectedAction of expectedValues) {
                    expect(actualValue, `Action not displayed ${expectedAction}`).to.includes(expectedAction)
                }
            } else {
                let expectedVal = hearing[column]
                if (column === "Hearing date") {
                    expectedVal = moment().add(expectedVal, 'days').format('D MMMM YYYY')
                }
                expect(actualValue, `Column ${column} value did not match`).to.includes(expectedVal)
            }
        }
    }
});



When('In hearings tab, I click action {string} for hearing {string} under table {string}', async function (action,hearingType, hearingsTable) {
    const hearingTableObj = hearingsTabPage.getTableObject(hearingsTable)
    await hearingTableObj.clickActionLinkForHearing(hearingType, action)
});

