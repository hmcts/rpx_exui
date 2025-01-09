
const browserWaits = require('../../support/customWaits')

Then('I see restricted case access page', async function(){
    const ele = $('exui-restricted-case-access-container')
    await browserWaits.waitForElement(ele)
    expect(await ele.isDisplayed()).to.be.true
})

Then('In restricted case accesspage, I see banner message {string}', async function (message) {
    const ele = element(by.xpath(`//exui-restricted-case-access-container//div[contains(@class,'hmcts-banner__message')]//span[contains(text(),'${message}')]`))
    await browserWaits.waitForElement(ele)
    expect(await ele.isDisplayed()).to.be.true
})


Then('In restricted case page, I see user table with headers', async function (headersDatatable) {


    const headers = headersDatatable.parse().hashes();
    for (const row of headers){
        const ele = element(`//exui-restricted-case-access//table//th[contains(text(),'${row.header}')]`)
        expect(await ele.isDisplayed(), `${row.header} not displayed`).to.be.true
    }

})

Then('In restricted case page, I see list of users with access', async function (usersDatatable) {
    
    // await new Promise((resolve,reject) => {
    //     setTimeout(() => {
    //         resolve(true)
    //     }, 1800*1000)
    // })
    const users = usersDatatable.parse().hashes();
    for (const row of users) {
        const ele = element(by.xpath(`//exui-restricted-case-access//table//td[contains(text(),'${row.user}')]`))
        expect(await ele.isDisplayed(), `${row.user} not displayed`).to.be.true
    }
})
