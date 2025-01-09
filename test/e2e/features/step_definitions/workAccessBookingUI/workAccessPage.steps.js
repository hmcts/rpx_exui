
const CucumberReportLogger = require('../../../support/reportLogger');

const moment = require('moment-timezone');

var { Then, When, Given } = require('@cucumber/cucumber');
const BrowserWaits = require('../../../support/customWaits');
const headerPage = require('../../pageObjects/headerPage');
const browserUtil = require('../../../../ngIntegration/util/browserUtil');
const workAccessPage = require('../../pageObjects/workAccessBookingUI/workAccessPage');
const workAllocationDateUtil = require('../../pageObjects/workAllocation/common/workAllocationDateUtil');

const createNewBookingWorkflow = require('../../pageObjects/workAccessBookingUI/createNewBookingWorkflow');
const customWaits = require('../../../support/customWaits');

  function getWorkAccessRadioButton(radioButtonName){
    const normalisedName = radioButtonName.toLowerCase();
    let retElement = null;
    if (normalisedName.includes('existing')) {
      retElement = workAccessPage.radioChooseExistingBooking;
    } else if (normalisedName.includes('create new')) {
      retElement = workAccessPage.radioCreateNewBooking;
    } else if (normalisedName.includes('view')) {
      retElement = workAccessPage.radioViewtasksAndCases;
    }
    if (!retElement){
      throw new Error(`Work access radio option "${radioButtonName}" not found in page `);
    }
    return retElement;
  }

  function getDateWithFormatForDays(inDays){
    let todayObj = moment();
    if (inDays > 0){
      todayObj = todayObj.add(inDays, 'days');
    } else if (inDays > 0){
      todayObj = todayObj.substract(inDays, 'days');
    }
    return todayObj.format(workAccessPage.dateFormat);
  }

  Then('I validate work access page isDisplayed is {string}', async function(isDisplayedString){
    await BrowserWaits.retryWithActionCallback(async () => {
      const expectedDisplayStatus = isDisplayedString.toLowerCase().includes('true') || isDisplayedString.toLowerCase().includes('yes');
      expect(await workAccessPage.amOnPage()).to.equal(expectedDisplayStatus);
    });
  });

  Then('I see work access page displayed', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await workAccessPage.amOnPage()).to.be.true;
    });
  });

  Then('I see work access radio button {string} displayed', async function(radioButtonName){
    await BrowserWaits.retryWithActionCallback(async () => {
      const radioButton = getWorkAccessRadioButton(radioButtonName);
      expect(await radioButton.isDisplayed()).to.be.true;
    });
  });

  Then('I see work access radio button {string} not displayed', async function (radioButtonName) {
    await BrowserWaits.retryWithActionCallback(async () => {
      const radioButton = getWorkAccessRadioButton(radioButtonName);
      expect(await radioButton.isDisplayed()).to.be.false;
    });
  });

  When('I select work access radio button {string}', async function (radioButtonName) {
    await BrowserWaits.retryWithActionCallback(async () => {
      const radioButton = getWorkAccessRadioButton(radioButtonName);
      expect((await radioButton.isPresent() && await radioButton.isDisplayed()), `Radio option ${radioButtonName} is not displayed`).to.be.true;
      await radioButton.click();
    });
  });

  Then('I see work access continue button displayed', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      const ispresent = await workAccessPage.continueButton.isPresent();
      if (ispresent) {
        expect(await workAccessPage.continueButton.isDisplayed()).to.be.true;
      } else {
        throw new Error('Assertion failed. expected false to be true');
      }
    });
  });

  Then('I see work access continue button not displayed', async function () {
    await BrowserWaits.retryWithActionCallback(async () => {
      const ispresent = await workAccessPage.continueButton.isPresent();
      if (ispresent) {
        expect(await workAccessPage.continueButton.isDisplayed()).to.be.false;
      }
    });
  });

  When('I click work access continue button', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      await workAccessPage.continueButton.click();
    });
  });

  Then('I see work access existing bookings list container', async function(){
    await BrowserWaits.retryWithActionCallback(async () => {
      expect(await workAccessPage.existingBookingsList.isDisplayed()).to.be.true;
    });
  });

  Then('I see work access existing bookings displayed with details', async function(datatable){
    const bookingsHashes = datatable.hashes();
    await customWaits.retryWithActionCallback(async () => {
      for (const booking of bookingsHashes) {
        workAllocationDateUtil.getDateFormat_DD_Month_YYYY(booking.fromDate);
        const fromDate = workAllocationDateUtil.getDateFormat_DD_Month_YYYY(booking.fromDate);
        const toDate = workAllocationDateUtil.getDateFormat_DD_Month_YYYY(booking.toDate);
        expect(await workAccessPage.isBookingDisplayed(booking.location, fromDate, toDate), `Booking with details not displayed: ${booking.location}, ${fromDate} to ${toDate}`).to.be.true;
      }
    });
  });

  Then('I validate work access existing bookings', async function () {
    const displayedBookingsCount = await workAccessPage.getExistingBooksingCount();
    for (let i = 0; i < displayedBookingsCount; i++){
      const bookingDetails = await workAccessPage.getBookingDetails(i);
      expect(bookingDetails.location.length > 0, `Booking location at index ${i} is not displayed or empty`).to.be.true;
      expect(bookingDetails.fromDate.length > 0, `Booking from date at index ${i} is not displayed or empty`).to.be.true;
      expect(bookingDetails.toDate.length > 0, `Booking to date at index ${i} is not displayed or empty`).to.be.true;
    }
  });

  When('I click continue for any existing booking in work access page', async function(){
    const allBookings = await workAccessPage.getExistingBookingsDetails();
    if (allBookings.length === 0){
      throw new Error('No existing bookings avilable.displayed');
    }
    await allBookings[0].continueBtnElement.click();
  });

  When('I click existing booking with matching location {string} from work access page', async function(location){
    const allBookings = await workAccessPage.getExistingBookingsDetails();
    const bookingsForLocation = allBookings.filter((booking) => booking.location.includes(location));

    if (bookingsForLocation.length === 0){
      throw new Error(`No maytching bookings for location ${location} found`);
    }
    await bookingsForLocation[0].continueBtnElement.click();
  });

  When('I enter location search text {string} in create booking page', async function(locationSearch){
    await createNewBookingWorkflow.searchLocation.waitForPage();
    await createNewBookingWorkflow.searchLocation.inputLocationText(locationSearch);
  });

  When('I select location at index {int} in create booking location search', async function (index) {
    await BrowserWaits.retryWithActionCallback(async () => {
      await createNewBookingWorkflow.searchLocation.selectResultLocationAtIndex(index);
    });
  });

  When('I click continue in create new booking work flow', async function(){
    await createNewBookingWorkflow.continueButton.click();
  });

  When('I click continue to submit new booking work flow', async function () {
    await BrowserWaits.waitForElement(createNewBookingWorkflow.confirmBookingButton);
    await createNewBookingWorkflow.confirmBookingButton.click();
    await BrowserWaits.retryWithActionCallback(async () => {
      await BrowserWaits.waitForPageNavigation(await browser.getCurrentUrl());
    });
  });

  Then('I see create booking duration selection page', async function(){
    await createNewBookingWorkflow.chooseDurationPage.waitforPage();
  });

  When('I select duartion option {string} in create booking page', async function (option) {
    await createNewBookingWorkflow.chooseDurationPage.waitForPage();
    await createNewBookingWorkflow.chooseDurationPage.selectRadioOption(option);
  });

  Then('I see create booking summary details', async function(){
    await createNewBookingWorkflow.checkAnswersPage.waitForPage();
    const details = await createNewBookingWorkflow.checkAnswersPage.getSummaryListDetails();

    for(const bookingDetails of details){
      expect(bookingDetails.value.length > 0, `Create booking details ${bookingDetails.key} is not displayed`).to.be.true;
    }
  });

