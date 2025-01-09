const idamLogin = require("../../util/idamLogin");

const mockClient = require('../../../backendMock/client/index')
Given('I set MOCK browser cookies', async function () {

    let cookies = cookieString.replace(" ", "")
    cookies = cookies + ";xui-webapp=" + sessionToken;

    let cookiesList = cookies.split(";");
    cookiesList = cookiesList.map(cookie => {
        const kv = cookie.split('=')
        return { name: kv[0].trim(), value:kv[1].trim()}
    })

    browser.driver.manage().setCookies(cookiesList);
});


Given('I set debug browser user details', async function (datatable) {
    const rowsHash = datatable.parse().rowsHash()
    let cookies = cookieString.replace(" ","")
    cookies = cookies + ";xui-webapp=" + sessionToken
    const userDetails = await idamLogin.getUserDetailsWithCookieString(cookies)
    const properties = rowsHash;
    for (const key of Object.keys(properties)) {
        if (key === 'roles') {
            userDetails.userInfo[key] = properties[key].split(',').map(v => v.trim())
        } else {
            userDetails.userInfo[key] = properties[key]
        }

    }
    const auth = await browser.driver.manage().getCookie('__auth__')
    await mockClient.updateAuthSessionWithUserInfo(auth.value, userDetails.userInfo);
});

const cookieString = ""
const sessionToken = ""
