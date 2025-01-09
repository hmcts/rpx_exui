
const helper = require('codeceptjs').helper;


function getActor(){
    return actor().retry({ retries: 3, minTimeout: 30 });
}

class DriverManager{
    constructor(){
        this.sessionCookies = null
    }
    deleteAllCookies(){

    }

    async getCookies(){
        const cookiesString = await getActor().executeScript(function () {
            return document.cookie;
        })

        const cookies = cookiesString.split(';').map(cookie => {
            const nameValue = cookie.split("=")
            return { name: nameValue[0].trim(), value: nameValue[1].trim() }
        })
        this.sessionCookies = cookies
        return cookies
    }

    async getCookie(name) {
        const cookies = await this.getCookies();
        return cookies.find(cookie => cookie.name === name)

    }

    async setCookies(cookies){
        for(const cookie of cookies){
            cookie['path'] = '/';
            cookie['domain'] = 'localhost'
            await getActor().setCookie(cookie)
        }
    }
}

const driverManager = new DriverManager();

class Browser{
    constructor(){
        this.driver = {
            manage: () => driverManager
        }
        this.logs = [];
    }

    manage(){
        return driverManager;
    }

    get_I(){
        return getActor()
    }

    async sleep(seconds){
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve(true)
            }, seconds*1000)
        })
    }


    async sleepInMillisec(millisec) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, millisec )
        })
    }

    async pause(){
        await getActor().pause();
    }

    async get(url){
        await getActor().amOnPage(url);
    }

    async getCurrentUrl(){
        return await getActor().grabCurrentUrl()
    }

    async refresh(){
        const url = await this.getCurrentUrl();
        await this.get(url);
    }


    async handlePopups(){
        try{
            return getActor().cancelPopup();
        }catch(err){

        }

    }

    async executeScript(fn, element){
      if (element)
        return getActor().executeScript(fn, element.selector);
      else
        return undefined;
    }

    async getBrowserLogs(){
        return await getActor().grabBrowserLogs();
    }

    async captureBrowserLogs(){
        this.logs = await this.getBrowserLogs();
    }

    async scrollToElement(elementObj){
        const actor = getActor();
        return await actor.scrollTo(elementObj.selector)
    }

    async getSessionStorage(key) {
        return await getActor().executeScript((key) => {
            return window.sessionStorage[key]
        },key);
    }

    async getLocalStorage(key) {
        return await getActor().executeScript(function (key) {
            return window.localStorage[key]
        }, key);
    }

    async getCurrentWindowHandle(){
        return await getActor().grabCurrentWindowHandle();
    }

    async getAllWindowHandles() {
        return await getActor().grabAllWindowHandles();
    }
}


module.exports = new Browser()
