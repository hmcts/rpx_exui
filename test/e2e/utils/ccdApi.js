var Request = require('../utils/request');
var BrowserWaits = require('../support/customWaits');
const CucumberReportLogger = require('../support/reportLogger');
Button = require('../features/pageObjects/webdriver-components/button.js');

class CcdApi {
  constructor() {
    this.userName = 'lukesuperuserxui_new@mailnesia.com';
    this.password = 'Monday01';
  }

  async getCaseCreationpagesApiRes() {
    try{
      return await BrowserWaits.retryWithActionCallback(async () => {
        await Request.withSession(this.userName, this.password);
        let reqPath = 'data/internal/case-types/xuiTestCaseType/event-triggers/createCase?ignore-warning=false';
        const response = await Request.get(reqPath, { experimental: true });
        expect(response.status, `${reqPath} ccd api faild status code: ${response.status}`).to.eql(200);
        return response.data;
      });
    }catch(err){
      CucumberReportLogger.AddMessage('Error occured, will attempt again in 5sec '+err);
      await BrowserWaits.waitForSeconds(5);
      throw new Error(err);
    }
  }

  async getWorkbasketAPIRes(reqPath) {
    try {
      return await BrowserWaits.retryWithActionCallback(async () => {
        await Request.withSession(this.userName, this.password);
        const response = await Request.get(reqPath, { experimental: true });
        expect(response.status, `${reqPath} ccd api faild status code: ${response.status}`).to.eql(200);
        return response.data;
      });
    } catch (err) {
      CucumberReportLogger.AddMessage('Error occured, will attempt again in 5sec ' + err);
      await BrowserWaits.waitForSeconds(5);
      throw new Error(err);
    }
  }

  async getSearchInputsAPIRes(reqPath) {
    try {
      return await BrowserWaits.retryWithActionCallback(async () => {
        await Request.withSession(this.userName, this.password);
        const response = await Request.get(reqPath, { experimental: true });
        expect(response.status, `${reqPath} ccd api faild status code: ${response.status}`).to.eql(200);
        return response.data;
      });
    } catch (err) {
      CucumberReportLogger.AddMessage('Error occured, will attempt again in 5sec ' + err);
      await BrowserWaits.waitForSeconds(5);
      throw new Error(err);
    }
  }

  async getCasesApiReq(reqURL) {
    try {
      return await BrowserWaits.retryWithActionCallback(async () => {
        await Request.withSession(this.userName, this.password);
        let reqData = { size: 25 };
        const response = await Request.post(reqURL, reqData, { experimental: true });
        expect(response.status, `${reqURL} ccd api faild status code: ${response.status}`).to.eql(200);
        return response.data;
      });
    } catch (err) {
      CucumberReportLogger.AddMessage('Error occured, will attempt again in 5sec ' + err);
      await BrowserWaits.waitForSeconds(5);
      throw new Error(err);
    }
  }

  async getCaseResultsResponse() {
    try {
      return await BrowserWaits.retryWithActionCallback(async () => {
        let caseId = await this._getCaseId();
        await Request.withSession(this.userName, this.password);
        let reqPath = `data/internal/cases/${caseId}`;
        console.log('search case URL ::' + reqPath);
        const response = await Request.get(reqPath, { experimental: true });
        expect(response.status, `${reqPath} ccd api faild status code: ${response.status}`).to.eql(200);
        return response.data;
      });
    } catch (err) {
      CucumberReportLogger.AddMessage('Error occured, will attempt again in 5sec ' + err);
      await BrowserWaits.waitForSeconds(5);
      throw new Error(err);
    }
  }

  async _getCaseId() {
    let publicUrl;
    const caseId = await browser.wait(() => {
      return browser.getCurrentUrl().then((url) => {
        publicUrl = url;
        this.caseId = publicUrl.split('/').slice(5, 6).join('/');
        return this.caseId;
      }).catch((error) => {
        return error;
      });
    });
    return caseId;
  }
}
module.exports = new CcdApi();
