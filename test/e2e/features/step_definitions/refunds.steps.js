const RefundsPage = require('../pageObjects/refundsPage.js');
const headerPage = require('../pageObjects/headerPage');
const { Then, When, Given } = require('@cucumber/cucumber');

  let refundsPage = new RefundsPage();

  When(/^I click on Refunds button$/, async function () {
    await headerPage.clickRefunds();
  });

  Then(/^Refunds page should be displayed$/, async function () {
    let refundPageHeadings = [
      'Refund list',
      'Refunds to be approved',
      'Refunds returned to caseworker'
    ];
    await browser.waitForAngular();
    let renderedHeadings = await refundsPage.amOnPage();
    expect(renderedHeadings).to.include.all.members(refundPageHeadings);
  });

  When(/^I click Review case$/, async function () {
    await refundsPage.clickReviewCase();
  });

  Then(/^Review case page should be displayed$/, async function () {
    expect(await refundsPage.amOnReviewCasePage()).to.equal('Case list');
  });

  When(/^I click Process refund$/, async function () {
    await refundsPage.clickProcessRefund();
  });

  Then(/^Process refund page should be displayed$/, async function () {
    let processRefundPageHeadings = [
      'Review refund details',
      'What do you want to do with this refund?'
    ];
    let renderedHeadings = await refundsPage.amOnProcessRefundPage();
    let processRefundPageFields = {
      reviewRefundDetailsTableColumns: [
        'Payment to be refunded',
        'Reason for refund',
        'Amount to be refunded',
        'Submitted by',
        'Date submitted'
      ],
      refundActionsLabels: [ 'Approve', 'Reject', 'Return to caseworker' ],
      refundActionsHints: [
        'Send to middle office',
        'There is no refund due',
        'Some information needs correcting'
      ]
    };
    let processDetailsInfo = await refundsPage.getProcessRefundsInfo();
    expect(renderedHeadings).to.include.all.members(processRefundPageHeadings);
    Object.keys(processRefundPageFields).forEach((key) => {
      expect(processDetailsInfo[key]).to.include.all.members(processRefundPageFields[key]);
    });
  });

  When(/^I click Review refund$/, async function () {
    await refundsPage.clickReviewRefund();
  });

  Then(/^Review refund page should be displayed$/, async function () {
    let reviewRefundPageHeadings = [
      'Refund details',
      'Refund status history'
    ];
    let renderedHeadings = await refundsPage.amOnReviewRefundPage();
    let reviewRefundPageFields = {
      refundDetailsTableColumns: [
        'Refund reference',
        'Payment to be refunded',
        'Reason for refund',
        'Amount refunded'
      ],
      refundStatusHistoryColumns: [ 'Status', 'Date and time', 'Users', 'Notes' ]
    };
    let reviewDetailsInfo = await refundsPage.getReviewRefundsInfo();
    expect(renderedHeadings).to.include.all.members(reviewRefundPageHeadings);
    Object.keys(reviewRefundPageFields).forEach((key) => {
      expect(reviewDetailsInfo[key]).to.include.all.members(reviewRefundPageFields[key]);
    });
  });
