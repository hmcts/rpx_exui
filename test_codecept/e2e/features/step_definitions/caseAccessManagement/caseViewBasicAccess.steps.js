var { defineSupportCode } = require('cucumber');
const reportLogger = require('../../../../codeceptCommon/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const caseDetailsPage = require("../../pageObjects/caseDetailsPage");
const caseRolesAndAccessPage = require("../../pageObjects/workAllocation/caseRolesAccessPage");

const ArrayUtil = require('../../../utils/ArrayUtil');

const workFlowPage = require("../../pageObjects/caseAccessManagement/SARWorkflow");
const { DataTableArgument } = require('codeceptjs');

const caseDetailsBasicViewPage = require('../../pageObjects/caseAccessManagement/caseDetailsBasicView')
const challengedAccessRequestPage = require('../../pageObjects/caseAccessManagement/challengedAccessRequestPage')
const specificAccessRequestPage = require('../../pageObjects/caseAccessManagement/specificAccessRequestPage')


    Then('I see case details basic view and request access page', async () =>{
        await BrowserWaits.waitForElement(caseDetailsBasicViewPage.container)
    })

    Then('I see case details basic view displays banner with message {string}', async (message) => {
        await BrowserWaits.waitForElement(caseDetailsBasicViewPage.bannerMessageContainer)
        const bannerMessage = await caseDetailsBasicViewPage.bannerMessageContainer.getText()
        expect(bannerMessage).to.contains(message);
    })

    Then('I see case details basic view displays case property {string} with values {string}', async (attribute, value) => {
        await BrowserWaits.waitForElement(caseDetailsBasicViewPage.bannerMessageContainer)
        expect(await caseDetailsBasicViewPage.isRowDisplayedWithAttribute(attribute), 'Attribute not displayed').to.be.true
        expect(await caseDetailsBasicViewPage.getAttributeValues(attribute)).to.contains(value)
    })

    When('I click request access button in case basic view page', async () => {
        await caseDetailsBasicViewPage.requestAccessButton.click() 
    })

    Then('I see challenged access request page' , async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await challengedAccessRequestPage.container.isDisplayed()).to.be.true

        });
    })

    When('In challenged access request page, I select radio option {string}', async (radioOption) => {
        await challengedAccessRequestPage.selectRadioOption(radioOption)
    })

    Then('In challenged access request page, I see case reference input', async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await challengedAccessRequestPage.caseReferenceInput.isDisplayed()).to.be.true
        })
    })

    Then('In challenged access request page, I do not see case reference input', async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await challengedAccessRequestPage.caseReferenceInput.isDisplayed()).to.be.false
        })
    })

    When('In challenged access request page, I enter case reference {string}', async (caseRef) => {
        await challengedAccessRequestPage.caseReferenceInput.sendKeys(caseRef)
    })


    Then('In challenged access request page, I see other reason input', async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await challengedAccessRequestPage.otherReasonTextArea.isDisplayed()).to.be.true
        })
    })

    Then('In challenged access request page, I do not see other reason input', async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await challengedAccessRequestPage.otherReasonTextArea.isDisplayed()).to.be.false
        })
    })

    When('In challenged access request page, I enter other reason {string}', async (reason) => {
        await challengedAccessRequestPage.otherReasonTextArea.sendKeys(reason)
    })

    When('In challenged access request page, I click submit', async () => {
        await challengedAccessRequestPage.submitBtn.click()
    })

    When('In challenged access request page, I click cancel', async () => {
        await challengedAccessRequestPage.cancelLink.click()
    })

    When('I see challenged access request success page', async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await challengedAccessRequestPage.challengedAccessSuccessContainer.isDisplayed()).to.be.true
        })
    })

    Then('I see specific access request page', async () => {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await specificAccessRequestPage.container.isDisplayed()).to.be.true
        });
    })

    When('In specific access request page, I enter reason {string}', async (reason) => {
        await specificAccessRequestPage.provideReasonInput.sendKeys(reason)
    })

When('In specific access request page, I click submit', async () => {
    await specificAccessRequestPage.submitBtn.click()
})

Then('I see specific access request success page', async () => {
    await BrowserWaits.retryWithActionCallback(async () => {
        expect(await specificAccessRequestPage.requestSuccessPageContainer.isDisplayed()).to.be.true
    })
})


