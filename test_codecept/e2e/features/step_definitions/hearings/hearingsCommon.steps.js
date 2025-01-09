
const createHearingWorkflow = require('../../pageObjects/hearings/createHearingWorkflow/createhearingWorkflow')
const reportLogger = require('../../../../codeceptCommon/reportLogger')

const browserWaits = require('../../../support/customWaits')


function getPageObject(page) {
    const pageObj = createHearingWorkflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(createHearingWorkflow.pages)}`)
    }
    return pageObj;
}


Then('I am on hearings workflow page {string}', async function (page) {
    await browserWaits.retryWithActionCallback(async () => {
        expect(await getPageObject(page).isDisplayed(), `${page} not displayed`).to.be.true
    })
})


Then('In hearings requirements page, I see case flags displayed for parties', async function (partiesDatatable) {
    const expectedPartyNames = partiesDatatable.parse().hashes();
    const hearingRequirementPage = getPageObject("Hearing requirements");
    const parties = await hearingRequirementPage.getPartiesWithCaseFlagsDisplayed()

    reportLogger.AddMessage(`Parties with case flags ${JSON.stringify(parties)}`)
    for (const party of expectedPartyNames){
        const partyWithName = parties.find(p => p.includes(party.partyName))

        expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.not.equal(undefined)
        if (party.label) {
            if (party.label === '') {
                expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.not.includes('AMENDED')
                expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.not.includes('ACTION NEEDED')


            } else {
                expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.includes(party.label)

            }
        }
    }

})

Then('In hearings Participant attendance page, I see parties', async function (partiesDatatable){
    const expectedPartyNames = partiesDatatable.parse().hashes();
    const participantsPage = getPageObject("Participant attendance");
    const parties = await participantsPage.getPartiesDisplayed()

    reportLogger.AddMessage(`Parties  ${JSON.stringify(parties)}`)
    for (const party of expectedPartyNames) {
        const partyWithName = parties.find(p => p.includes(party.partyName))
        expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.not.equal(undefined)
        if (party.label){
            if (party.label === ''){
                expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.not.includes('AMENDED')
                expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.not.includes('ACTION NEEDED')


            }else{
                expect(partyWithName, `${parties} missing expected ${party.partyName}`).to.includes(party.label)

            }
        }
    }

})



Then('In Additional facilities page, I see case flags displayed for parties', async function (partiesDatatable) {
    const expectedPartyNames = partiesDatatable.parse().hashes();
    const additionalFacilitiesPage = getPageObject("Do you require any additional facilities?");
    const parties = await additionalFacilitiesPage.getPartiesWithCaseFlagsDisplayed()

    reportLogger.AddMessage(`Parties  ${JSON.stringify(parties)}`)
    for (const party of expectedPartyNames) {
        expect(parties.find(p => p.includes(party.partyName)), `${parties} missing expected ${party.partyName}`).to.not.equal(undefined)
    }

})

async function validatePartyFlagsDisplayed(partyName,flagsDatatable){
    const flags = flagsDatatable.parse().hashes()
    const additionalFacilitiesPage = getPageObject("Do you require any additional facilities?");
    const partyFlags = await additionalFacilitiesPage.getCaseFlagsDisplayedForParty(partyName)

    reportLogger.AddMessage(`Parties  ${JSON.stringify(partyFlags)}`)

    for (const expectedFlag of flags) {
        const isFlagDisplayed = partyFlags.find(f => f.includes(expectedFlag.flag))
        expect(isFlagDisplayed, `${expectedFlag.flag} not displayed`).to.not.equal(undefined)
        if (expectedFlag.label === '') {
            expect(isFlagDisplayed.includes('AMENDED'), `${expectedFlag.flag} has AMENDED label`).to.be.false
            expect(isFlagDisplayed.includes('ACTION NEEDED'), `${expectedFlag.flag} has ACTION NEEDED label`).to.be.false
        } else {
            expect(isFlagDisplayed, `${expectedFlag.flag} not displayed`).to.includes(expectedFlag.label)
        }

    }

}


Then('In hearing requirements page, I see party {string} with case flags', async function (partyName, flagsDatatable) {
    await validatePartyFlagsDisplayed(partyName, flagsDatatable)

})

Then('In Additional facilities page, I see party {string} with case flags', async function (partyName, flagsDatatable) {
    await validatePartyFlagsDisplayed(partyName, flagsDatatable)

})

Then('In additional facilities page, I see case flags displayed for parties', async function (partiesDatatable){
    const expectedPartyNames = partiesDatatable.parse().hashes();
    const additionalFacilitiesPage = getPageObject("Do you require any additional facilities?");
    let parties = await additionalFacilitiesPage.getPartiesWithCaseFlagsDisplayed()
    parties = parties.map((partyName) => partyName.trim())
    reportLogger.AddMessage(`Parties with case flags ${JSON.stringify(parties)}`)
    for (const party of expectedPartyNames) {
        expect(parties).to.includes(party.partyName)
    }
})


Then('In Length, date and priority level of hearing page, I see ACTION NEEDED label displayed for The first date of the hearing must be', async function () {
    const page = getPageObject("Length, date and priority level of hearing");
    expect(await page.isActionNeededLabelDisplayedForField('The first date of the hearing must be')).to.be.true
})

Then('In Length, date and priority level of hearing page, I see AMENDED label displayed for Length of hearing', async function () {
  const page = getPageObject("Length, date and priority level of hearing");
  expect(await page.isActionNeededLabelDisplayedForField('Length of hearing')).to.be.true
})

Then('In Length, date and priority level of hearing page, I see AMENDED label displayed for the latest end date', async function () {
  const page = getPageObject("Length, date and priority level of hearing");
  expect(await page.isActionNeededLabelDisplayedForField('Latest end date')).to.be.true
})

Then('In Length, date and priority level of hearing page, I see no label displayed for the earliest end date', async function () {
  const page = getPageObject("Length, date and priority level of hearing");
  expect(await page.isActionNeededLabelDisplayedForField('Earliest start date')).to.be.false
})

Then('In Length, date and priority level of hearing page, I dont see ACTION NEEDED label displayed for The first date of the hearing must be', async function () {
    const page = getPageObject("Length, date and priority level of hearing");
    expect(await page.isActionNeededLabelDisplayedForField('The first date of the hearing must be')).to.be.false
})



