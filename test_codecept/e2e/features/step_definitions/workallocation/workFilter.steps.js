
var { defineSupportCode } = require('cucumber');
const reportLogger = require('../../../../codeceptCommon/reportLogger');
const BrowserWaits = require('../../../support/customWaits');
const SoftAssert = require('../../../../ngIntegration/util/softAssert');

const WACasesListTable = require('../../pageObjects/workAllocation/casesTable');

const myWorkPage = require('../../pageObjects/workAllocation/myWorkPage');


const ArrayUtil = require('../../../utils/ArrayUtil');
const { DataTableArgument } = require('codeceptjs');




    Then('I see work filter of type {string} is displayed',async function(filterType){
        await BrowserWaits.retryWithActionCallback(async () => {
            const filterContainer = myWorkPage.getFilterContainer(filterType)
            await BrowserWaits.waitForElement(filterContainer);
            expect(await myWorkPage.isWorkFilterOfTypeDisplayed(filterType)).to.be.true;
        });
    });

    Then('I see work filter of type {string} is not displayed', async function (filterType) {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.isWorkFilterOfTypeDisplayed(filterType)).to.be.false;
        });
    });

    Then('I see work filter button displayed', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            await BrowserWaits.waitForElement(myWorkPage.showHideWorkFilterBtn);
            expect(await myWorkPage.showHideWorkFilterBtn.isDisplayed()).to.be.true
        });
    });

    Then('I validate work filter button text is {string}', async function (btntext) {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.showHideWorkFilterBtn.getText()).to.contains(btntext);
        });
    });

    When('I click work filter button to {string} filter', async function (filterStateTo) {
        await BrowserWaits.retryWithActionCallback(async () => {
            const buttonText = await myWorkPage.showHideWorkFilterBtn.getText();
            reportLogger.AddMessage(`Button text before click "${buttonText}"`);
            if (buttonText.toLowerCase().includes(filterStateTo.toLowerCase())){
                reportLogger.AddMessage(`Clicking button with text "${buttonText}"`);

                await myWorkPage.showHideWorkFilterBtn.click();
                await BrowserWaits.waitForSeconds(1);
            } 
            const afterClickButtonText = await myWorkPage.showHideWorkFilterBtn.getText();
            reportLogger.AddMessage(`Button text after click "${afterClickButtonText}"`);

            expect(afterClickButtonText.toLowerCase().includes(filterStateTo.toLowerCase())).to.be.false;

        } );
    });

    Then('I validate location filter is displayed', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            try{
                await BrowserWaits.waitForSeconds(1);
                expect(await myWorkPage.genericFilterContainer.isPresent()).to.be.true;;
            }catch(err){

                await myWorkPage.showHideWorkFilterBtn.click();
                throw new Error(err); 
           }

        });
    });

    Then('I validate location filter is not displayed', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.genericFilterContainer.isPresent(), 'location filter is still displayed').to.be.false;;
        });

    });

    Then('I validate My work filter locations displayed', async function () {
        await myWorkPage.waitForWorkFilterToDisplay();
        expect(await myWorkPage.getWorkFilterLocationsCount() > 0, 'No location inputs displayed').to.be.true;;
    });

    Then('I validate work locations selected count is {int}', async function (selectedLocationsCount) {
        await myWorkPage.waitForWorkFilterToDisplay();
        const selectedLocs = await myWorkPage.getListOfSelectedLocations();
        expect(selectedLocs.length, 'selected locations count not matching').to.equal(selectedLocationsCount);

    });

    When('I click work location filter with label {string}', async function (workLocationLabel) {
        await myWorkPage.waitForWorkFilterToDisplay();
        await myWorkPage.clickWorkFilterLoctionInputWithLabel(workLocationLabel);
    });

    async function validateLocationsSelected(locationsDatatable){
        const selectedLocations = await myWorkPage.getListOfSelectedLocations();
        const locationNameHashes = locationsDatatable.parse().hashes()
        const locationNamesArr = [];
        for (let i = 0; i < locationNameHashes.length; i++) {
            locationNamesArr.push(locationNameHashes[i].locationName);
        }
        expect(selectedLocations, 'actual missing expected locations').to.have.same.members(locationNamesArr);
        //expect(locationNamesArr,'actual has more locations selected').to.include.all.members(selectedLocations);
    }

    Then('I validate following work location selected', async function (locationsDatatable) {
        validateLocationsSelected(locationsDatatable); 
    });

    Then('I validate following work location selected, if {string} equals {string}', async function (var1,var2,locationsDatatable) {
        if(var1 === var2){
            validateLocationsSelected(locationsDatatable);
        }else{
            reportLogger.AddMessage(`skiping step as condition not matching for scenario, ${var1} != ${var2}`);
        }
    });



    When('I click work location filter Apply button', async function () {
        await myWorkPage.waitForWorkFilterToDisplay();
        await myWorkPage.workFilterApplyBtn.click();
    });

    When('I click work location filter Reset button', async function () {
        await myWorkPage.waitForWorkFilterToDisplay();
        await myWorkPage.workFilterRestBtn.click();
    });

    Then('I validate work location filter batch and hint labels are displayed', async function () {
        expect(await myWorkPage.showHideFilterBadge.isPresent()).to.be.true;
        expect(await myWorkPage.showHideFilterHint.isPresent()).to.be.true;
    });

    Then('I validate work location filter batch and hint labels are not displayed', async function () {
        expect(await myWorkPage.showHideFilterBadge.isPresent()).to.be.false;
        expect(await myWorkPage.showHideFilterHint.isPresent()).to.be.false;
    });

    // New work filters updated

    Then('I validate my work filter services container displayed', async function(){
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.workFilterServicesContainer.isPresent()).to.be.true
            expect(await myWorkPage.workFilterServicesContainer.isDisplayed()).to.be.true 
        });
        
    });

    Then('I validate my work filter services container not displayed', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.workFilterServicesContainer.isPresent()).to.be.false
        });

    });

    Then('I validate my work filter location search displayed', async function(){
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await myWorkPage.workFiltersLocationsContainer.isPresent()).to.be.true
            expect(await myWorkPage.workFiltersLocationsContainer.isDisplayed()).to.be.true
        });    
    });

    Then('I validate my work filter services listed', async function(expectedServicesDatatable){
        const datatableHashes = expectedServicesDatatable.parse().hashes()
        const expectedServieNames= [];
        for (const hash of datatableHashes){
            expectedServieNames.push(hash.name);
        }
        
        const servicesListed = await myWorkPage.getWorkFilterServicesList();
        expect(servicesListed).to.contains.members(expectedServieNames)
    });


    Then('I validate my work filter services listed {string}', async function(servicesListString){
        const services = servicesListString.split(",");
        const servicesListed = await myWorkPage.getWorkFilterServicesList();
        expect(servicesListed).to.contains.members(services)
 
    });

    Then('I Validate my work filter services selected {string}', async function (servicesSelectedString) {
        const services = servicesSelectedString.split(",");
        const expectedServicesSelected = await myWorkPage.getWorkFilterServicesList();

        for (const selectedService of expectedServicesSelected) {
            expect(await myWorkPage.isWorkFilterServiceSelected(selectedService)).to.be.true;
        }
    });

    Then('I Validate my work filter services selected', async function (expectedServicesDatatable){
        const datatableHashes = expectedServicesDatatable.parse().hashes();
        const expectedServieNames = [];
        for (const hash of datatableHashes) {
            expectedServieNames.push(hash.name);
        }

        for (const selectedService of expectedServieNames){
            expect(await myWorkPage.isWorkFilterServiceSelected(selectedService)).to.be.true;
        }

    });


    Then('I validate my work filter locations selected', async function (expectedLocationsDatatable){
        const datatableHashes = expectedLocationsDatatable.parse().hashes();
        const expectedLocations = [];
        for (const hash of datatableHashes) {
            expectedLocations.push(hash.name);
        }

        const actualSelectedLocations = await myWorkPage.getWorkFilterSelectedLocations();
        for (const loc of expectedLocations ){
            expect(actualSelectedLocations).to.includes(loc);
        }

    });

    When('I select service {string} in my work filter', async function(service){
        await myWorkPage.selectWorkFilterService(service);
    });
  
    When('I unselect service {string} in my work filter', async function (service) {
        await myWorkPage.unselectWorkFilterService(service);
    });

    When('I search for location text {string} in my work filters', async function(location){
        await myWorkPage.workFilterSearchLocationInput.clear();
        await myWorkPage.workFilterSearchLocationInput.sendKeys(location);

    });


    Then('I see location search results in my work filter', async function (expectedLocationsDatatable){
        reportLogger.reportDatatable(expectedLocationsDatatable)
        const datatableHashes = expectedLocationsDatatable.parse().hashes();
        const expectedLocations = [];
        for (const hash of datatableHashes) {
            expectedLocations.push(hash.name);
        } 
        
        await BrowserWaits.retryWithActionCallback(async () => {
            let locationResults = await myWorkPage.getWorkFilterLocationSearchResults();
            locationResults = locationResults.map(locname => locname.trim())
            for (const expectLoc of expectedLocations) {
                expect(locationResults).to.includes(expectLoc);
            }
        });
        
    });

    Then('I see location search results returned {int} results in my work filter', async function (expectecResults) {
        
        await BrowserWaits.retryWithActionCallback(async () => {
            const locationResults = await myWorkPage.getWorkFilterLocationSearchResults();
            expect(locationResults.length, "Expected results count does not match").to.equal(expectecResults); 
        });

    });



    When('I select locations search result {string} in my work filter', async function(location){
        await myWorkPage.selectWorkFilterLocationSearchResult(location);
    });

    When('I click add location button in my work filter', async function(){
        await myWorkPage.addLocationButton.click();
    });

    Then('I see location {string} selected in my work filter', async function(location){
        let locationsSelected = await myWorkPage.getWorkFilterSelectedLocations();
        locationsSelected = locationsSelected.map(locName => locName.trim())
        expect(locationsSelected).to.includes(location);
    });

    Then('I see error message {string} for service work filter in my work page', async function(message){
        expect(await myWorkPage.workFilterServiceErrorMessage.getText()).to.includes(message);
    });


    Then('I see error message {string} for location work filter in my work page', async function (message) {
        expect(await myWorkPage.workFilterlocationErrorMessage.getText()).to.includes(message);
    });

    When('I remove slected location {string} from my work filters', async function(location){
        await myWorkPage.clickSelectedLocationFromWorkFilter(location);
    });


    When('I remove all selected locations from my work filters', async function () {
        await myWorkPage.clearAllSelectedLocations();
    });

  

