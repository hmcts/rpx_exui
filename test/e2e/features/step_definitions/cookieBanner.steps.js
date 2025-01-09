var CookieBanner = require('../pageObjects/common/cookieBanner');

var { Then, When, Given } = require('@cucumber/cucumber');


  When('I click \'Accept additional cookies\'', async function () {
    await CookieBanner.acceptCookies();
  });

  Then('I see the analytical cookies', async function () {
    expect(await CookieBanner.isCookiePresent('_ga')).to.be.true;
    expect(await CookieBanner.isCookiePresent('_gid')).to.be.true;
  });

  When('I click \'Reject additional cookies\'', async function () {
    await CookieBanner.rejectCookies();
  });

  Then('I don\'t see any analytical cookie', async function () {
    expect(await CookieBanner.isCookiePresent('_ga')).to.be.false;
    expect(await CookieBanner.isCookiePresent('_gid')).to.be.false;
  });
