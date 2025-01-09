
const CucumberReportLogger = require('../../../codeceptCommon/reportLogger');

var { defineSupportCode } = require('cucumber');
const BrowserWaits = require("../../support/customWaits");
const caseDetailsPage = require("../pageObjects/caseDetailsPage");
const mediaViewerPage = require("../pageObjects/mediaViewerPage");
const caseDetailsBasicViewPage = require('../pageObjects/caseAccessManagement/caseDetailsBasicView');
const { I } = inject();


   
    Then('I see case details tab label {string} is displayed is {string}', async function (tabLabel, boolString) {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel)).to.equal(boolString.toLowerCase().includes('true'))
        });

    });

    Then('I see case details tab label {string} is selected is {string}', async function (tabLabel, boolString) {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel)).to.equal(boolString.toLowerCase().includes('true'))
        });

    });

    Then('I see case details tab label {string} displayed', async function(tabLabel){
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel)).to.be.true
        });
        
    });

    Then('I see case details tab label {string} not displayed', async function (tabLabel) {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel)).to.be.false
        });

    });


    Then('I see case details tab with label {string} is selected', async function (tabLabel){
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel)).to.be.true
        });
    });

    Then('I see case details tab with label {string} is not selected', async function (tabLabel) {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel)).to.be.false
        });
    });

    When('I click tab with label {string} in case details page', async function (tabLabel) {
        await BrowserWaits.retryWithActionCallback(async () => {
            await caseDetailsPage.clickTabWithLabel(tabLabel)    
        });
    });

    When('I click tab with label {string} in case details page, to see element with css selector {string}', async function (tabLabel, cssSelector) {
        await BrowserWaits.retryWithActionCallback(async () => {
            await caseDetailsPage.clickTabWithLabel(tabLabel) 
            await BrowserWaits.waitForSeconds(2)
            await caseDetailsPage.clickTabWithLabel(tabLabel) 

            await BrowserWaits.waitForElement($(cssSelector))
            expect(await $(cssSelector).isDisplayed()).to.be.true
        });

    });


    Then('I see case details page displayed with tab {string} selected', async function(tabLabel){
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await caseDetailsPage.amOnPage(), 'Not on case details page').to.be.true;
            expect(await caseDetailsPage.isTabWithLabelPresent(tabLabel), `Tab with label "${tabLabel}" is not present or displayed`).to.be.true;
            expect(await caseDetailsPage.isTabWithLabelSelected(tabLabel), `Tab with label "${tabLabel}" is not selected`).to.be.true;
        }); 
    });

    Then('I see case details page with message banner {string}', async function(expectedBannerMessage){
        await BrowserWaits.retryWithActionCallback(async () => {
            const actualBannerMessage = await caseDetailsPage.messageBanner.getBannerMessagesDisplayed();
            expect(actualBannerMessage.join(",")).to.includes(expectedBannerMessage)
        });
        
    });

    When('I open linked document', async () => {
        await caseDetailsPage.openLinkedDocument()
    })

    When('I open dummy document', async () => {
        await caseDetailsPage.openDummyFile()
    })

    Then('I verify that text redaction is working', async function() {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await mediaViewerPage.verifyRedactionWorking()).to.be.true;
        });
    });

    Then('I verify that bookmark feature is working', async function() {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await mediaViewerPage.verifyBookmarkWorking()).to.be.true;
        });
    });

    Then('I verify that comment feature is working', async function() {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await mediaViewerPage.verifyCommentWorking(I)).to.be.true;
        });
    });