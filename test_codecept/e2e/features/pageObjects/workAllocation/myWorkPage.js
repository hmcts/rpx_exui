const TaskList = require('./taskListTable');
const BrowserWaits = require('../../../support/customWaits');
var cucumberReporter = require('../../../../codeceptCommon/reportLogger');

var TaskMessageBanner = require('../messageBanner');
const { LOG_LEVELS } = require('../../../support/constants');
const { constant } = require('lodash');

class MyWorkPage extends TaskList {

    constructor() {
        super();
        this.pageHeader = $('exui-work-allocation-home exui-task-home h3.govuk-heading-xl');
        this.showHideWorkFilterBtn = element(by.xpath("//button[contains(text(),'work filter')]"));
        this.showHideFilterBadge = element(by.xpath("//button[contains(text(),'work filter')]/following-sibling::span[contains(text(),'Filtered view')]"));
        this.showHideFilterHint = element(by.xpath("//button[contains(text(),'work filter')]/following-sibling::span[contains(text(),'All of your work may not be visible.')]"));

        this.genericFilterContainer = $('xuilib-generic-filter');
        // this.workFilterLocationContainers = $$('.xui-generic-filter #checkbox_locations .govuk-checkboxes__item');


        //Services filters
        this.workFilterServicesContainer = $('.xui-generic-filter#services');
        this.workFilterServicesHeader = $('.xui-generic-filter#services h3');
        this.workFilterServiceCheckboxeItems = $$('.xui-generic-filter#services .govuk-checkboxes__item');
        this.workFilterServiceErrorMessage = $('.xui-generic-filter#services #services-error');
        //Locations filters
        this.workFiltersLocationsContainer = $('.xui-generic-filter#locations');
        this.workFilterSearchLocationInput = $('.xui-generic-filter#locations exui-search-location input');
        this.workFilterLocationSearchResults = $$('.cdk-overlay-container .mat-autocomplete-panel mat-option span');
        this.addLocationButton = $('.xui-generic-filter#locations xuilib-find-location .location-picker-custom a');

        this.selectedLocations = $$('.xui-generic-filter#locations xuilib-find-location .location-picker-custom .location-selection a');
        this.workFilterlocationErrorMessage = $('.xui-generic-filter#locations #locations-error');

        //Work type filters
        this.workFilterWorkTypesContainer = $('.xui-generic-filter#types-of-work');
        this.workFilterTypesOfWork = $$('.xui-generic-filter #checkbox_types-of-work .govuk-checkboxes__item');

        this.workFilterApplyBtn = $('xuilib-generic-filter #applyFilter');
        this.workFilterRestBtn = $('xuilib-generic-filter #cancelFilter');
        //end of work filter locators

        this.subNavListContainer = $('xuilib-hmcts-sub-navigation .hmcts-sub-navigation__list');
       
        this.myTasksContaine = $('exui-my-tasks');
        this.availableTasksContainer = $('exui-available-tasks');

        this.bannerMessageContainer = $('exui-info-message ')
        this.infoMessages = $$('exui-info-message .hmcts-banner__message');

        this.taskInfoMessageBanner = new TaskMessageBanner("exui-work-allocation-home exui-task-home");
    }

    async waitForWorkFilterToDisplay(){
        await BrowserWaits.waitForElement(this.genericFilterContainer);
    }

    getSubNavigationTabElement(tabLabel){
        return element(by.xpath(`//exui-task-home//a[contains(text(),'${tabLabel}')]`));
    }

    async isSubNavigationTabPresent(tabLabel){
        return await this.getSubNavigationTabElement(tabLabel).isPresent();
    }

    async clickSubNavigationTab(tabLabel){
        await BrowserWaits.waitForElement(this.subNavListContainer);
        await this.getSubNavigationTabElement(tabLabel).click();
    }

    async isSubNavigationTabSelected(tabLabel){
        return this.getSubNavigationTabElement(tabLabel).getAttribute('aria-current') !== null;
    }

    async getWorkFilterLocationsCount(){
        return await this.workFilterLocationContainers.count();
    }

    async getWorkFilterTypesOfCount() {
        return await this.workFilterTypesOfWork.count();
    }

    async OpenWorkFilter(){
        const isOpen = await this.genericFilterContainer.isPresent() && await this.genericFilterContainer.isDisplayed();

        if (!isOpen){
            await this.showHideWorkFilterBtn.click();
        }
    }

    async CloseWorkFilter() {
        const isOpen = await this.genericFilterContainer.isPresent() && await this.genericFilterContainer.isDisplayed();

        if (isOpen) {
            await this.showHideWorkFilterBtn.click();
        }
    }

    async clickWorkFilterLoctionInputWithLabel(locationLabel){
        await element(by.xpath(`//div[contains(@class,'xui-generic-filter')]//div[contains(@class,'govuk-checkboxes__item')]/label[contains(text(),'${locationLabel}')]/../input`)).click();
    }

    async selectWorkFilterLocationAtPosition(locationAtPos){
        const locCount = await this.getWorkFilterLocationsCount();
        if (locationAtPos > locCount || locationAtPos <= 0){
            throw Error('location pos is out of bound');
        }

        const locInput = await this.workFilterLocationContainers.get(locationAtPos - 1);
        if(!(await locInput.isSelected())){
            await locInput.click();

        }
    }

    async getListOfSelectedLocations(){
        const selectedLocations = [];
        const locationsCount = await this.getWorkFilterLocationsCount();
        for (let i = 0; i < locationsCount; i++){
            const locElement = await this.workFilterLocationContainers.get(i);
            const isLocationSelected = await locElement.$('input').isSelected();
            if (isLocationSelected){
                selectedLocations.push(await locElement.$('label').getText());
            }
        }
        return selectedLocations;
    }

    async getListOfSelectedTypesOfWork() {
        const selectedLocations = [];
        const locationsCount = await this.getWorkFilterTypesOfCount();
        for (let i = 0; i < locationsCount; i++) {
            const locElement = await this.workFilterTypesOfWork.get(i);
            const isLocationSelected = await locElement.$('input').isSelected();
            if (isLocationSelected) {
                selectedLocations.push(await locElement.$('label').getText());
            }
        }
        return selectedLocations;
    }

    async amOnPage() {
        try{
            await BrowserWaits.waitForSpinnerToDissappear();
            await this.pageHeader.wait(20);
            await BrowserWaits.waitForConditionAsync(async () => {
                const pageHeaderTitle = await this.pageHeader.getText();
                return pageHeaderTitle.includes('My work');
            });
            return true;
        }catch(err){
            cucumberReporter.AddMessage("My work page not displayed "+err.stack, LOG_LEVELS.Error);
            return false;
        }
        
    }

    async clickMyTasks() {
        expect(await this.amOnPage(), "Not on Task lict page ").to.be.true;
        await this.myTasksTab.click();
    }

    async clickAvailableTasks() {
        expect(await this.amOnPage(), "Not on Task list page ").to.be.true;
        await this.availableTasksTab.click();
    }

    async amOnMyTasksTab() {
        return await this.myTasksContaine.isDisplayed();
    }

    async isMyTasksDisplayed() {
        expect(await this.amOnPage(), "Not on Task list page ").to.be.true;
        try {
            await BrowserWaits.waitForElement(this.myTasksContaine);
            return true;
        } catch (err) {
            cucumberReporter.AddMessage("My Tasks list page not displayed: " + err, LOG_LEVELS.Error);
            return false;
        }
    }

    async isAvailableTasksDisplayed() {
        expect(await this.amOnPage(), "Not on Task list page ").to.be.true;
        try {
            await BrowserWaits.waitForElement(this.availableTasksContainer);
            return true;
        } catch (err) {
            cucumberReporter.AddMessage("Available Tasks list page not displayed: " + err, LOG_LEVELS.Error);
            return false;
        }
    }

    async isBannerMessageDisplayed() {
        expect(await this.amOnPage(), "Not on Task list page ").to.be.true;
        return this.taskInfoMessageBanner.isBannerMessageDisplayed();
    }

    async getBannerMessagesDisplayed() {
        expect(await this.amOnPage(), "Not on Task list page ").to.be.true;
        return this.taskInfoMessageBanner.getBannerMessagesDisplayed();
    }

    async isBannermessageWithTextDisplayed(messageText) {
        const messages = await this.getBannerMessagesDisplayed();

        for (const message of messages) {
            if (message.includes(messageText)) {
                return true;
            }
        }
        return false;
    }

    async getWorkFilterServicesList(){
        const servicesCheckBoxItemsCount = await this.workFilterServiceCheckboxeItems.count();
        const returnValues = [];
        for (let i = 0; i < servicesCheckBoxItemsCount;i++ ){
            const checkBoxItem = await this.workFilterServiceCheckboxeItems.get(i);
            returnValues.push(await checkBoxItem.$('label').getText()); 
        }
        return returnValues;
    }

    async selectWorkFilterService(service){
        const serviceCheckBox = await this.getServiceCheckBox(service);
        const isChecked = await serviceCheckBox.isSelected();
        if (!isChecked) {
            await serviceCheckBox.click();
        }
    }

    async unselectWorkFilterService(service) {
        const serviceCheckBox = await this.getServiceCheckBox(service);
        const isChecked = await serviceCheckBox.isSelected();
        if (isChecked) {
            await serviceCheckBox.click();
        }
    }

    async isWorkFilterServiceSelected(service){
        const serviceCheckBox = await this.getServiceCheckBox(service);
        return serviceCheckBox.isSelected();  
    }

    async getServiceCheckBox(service) {
        const servicesCheckBoxItemsCount = await this.workFilterServiceCheckboxeItems.count();
        let serviceCheckBox = null;
        for (let i = 0; i < servicesCheckBoxItemsCount; i++) {
            const checkBoxItem = await this.workFilterServiceCheckboxeItems.get(i);
            const serviceName = await checkBoxItem.$('label').getText();
            if (serviceName.includes(service)) {
                serviceCheckBox = checkBoxItem.$('input');
               break;
            }
        }
        if (!serviceCheckBox){
            throw new Error(`Services check box with label ${service} is not found`);
        }
        return serviceCheckBox;
    }

    async getWorkFilterLocationSearchResults(){
        const count = await this.workFilterLocationSearchResults.count();
        const locations = [];
        for(let i = 0 ;i < count; i++){
            const loc = await await this.workFilterLocationSearchResults.get(i);
            locations.push(await loc.getText());
        }
        return locations;
    }

    async selectWorkFilterLocationSearchResult(location){
        const locationResult = element(by.xpath(`//div[contains(@class,'cdk-overlay-container')]//div[contains(@class,'mat-autocomplete-panel')]//mat-option//span[contains(text(),'${location}')]`))
        await locationResult.click();
    }

    async getWorkFilterSelectedLocations(){
        const count = await this.selectedLocations.count();
        const returnValue = [];
        for(let i = 0; i < count ; i++){
            const e = await this.selectedLocations.get(i);
            returnValue.push(await e.getText());
        }
        return returnValue;
    }

    async clickSelectedLocationFromWorkFilter(location){
        const count = await this.selectedLocations.count();
        const actualLocations = [];
        for(let i = 0; i < count ; i++){
            const e = await this.selectedLocations.get(i);
            const locationName = await e.getText();
            actualLocations.push(locationName);
            if (locationName.includes(location)){
                await e.click();
                return;
            } 
        }
        throw new Error(`location conating text ${location} is not found in selected location "${actualLocations}"`);
    }

    async clearAllSelectedLocations() {
        let count = await this.selectedLocations.count();

        while(count > 0){
            const e = await this.selectedLocations.get(0);
            await e.click();
            count = await this.selectedLocations.count(); 
        }
                 
        
    }

    getFilterContainer(filterType){

        const filterTypeNormalized = filterType.toLowerCase().split(' ').join('');

        let filterContainer = null;
        if (filterTypeNormalized.includes('service')) {
            filterContainer = this.workFilterServicesContainer;
        } else if (filterTypeNormalized.includes('location')) {
            filterContainer = this.workFiltersLocationsContainer;
        } else if (filterTypeNormalized.includes('worktype')) {
            filterContainer = this.workFilterWorkTypesContainer;
        } else {
            throw new Error(`${filterType} is not implemented in test. Please check Page object myWorkPage.js`);
        }
        return filterContainer;
    }

    async isWorkFilterOfTypeDisplayed(filterType){


        const filterContainer = this.getFilterContainer(filterType);

        return (await filterContainer.isPresent()) && (await filterContainer.isDisplayed());

    }

    async isWorkFilterOfTypeDisplayed(filterType){

        const filterTypeNormalized = filterType.toLowerCase().split(' ').join('');

        let filterContainer = null;
        if (filterTypeNormalized.includes('service')){
            filterContainer = this.workFilterServicesContainer;
        } else if (filterTypeNormalized.includes('location')){
            filterContainer = this.workFiltersLocationsContainer;
        } else if (filterTypeNormalized.includes('worktype')) {
            filterContainer = this.workFilterWorkTypesContainer;
        }else {
            throw new Error(`${filterType} is not implemented in test. Please check Page object myWorkPage.js`);
        }

        return (await filterContainer.isPresent()) && (await filterContainer.isDisplayed());

    }

}

module.exports = new MyWorkPage();
