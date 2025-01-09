var IacCase = require('../pageObjects/iacCase');

var { Then, When, Given } = require('@cucumber/cucumber');


  let iacCase = new IacCase();

  When('I check all fields IAC case', async function () {
    expect(await iacCase.getErrorMessageMandatoryField()).to.be.contain('Field is required');
    await iacCase.tellUsAboutYourClientPage();
    await iacCase.locationPage();
    await iacCase.homeOfficeDetailsPage();
    await iacCase.noticeOfDecisionPage();
    await iacCase.basicDetailsPage();
    await iacCase.nationalityPage();
    await iacCase.addressPage();
    await iacCase.contactPage();
    await iacCase.appealTypePage();
    await iacCase.appealGroundsPage();
    await iacCase.deportationOrderPage();
    await iacCase.newMattersPage();
    await iacCase.appealAgainstOtherDecisionsPage();
    await iacCase.legalRepDetailsPage();
  });

