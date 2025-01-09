import axios, { AxiosInstance } from 'axios';
import { config } from '../config/config';
import { getSessionCookieString ,updateSessionCookieString} from './authUtil';
import {reporterMsg, reporterJson} from './helper'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

axios.defaults.headers.common['Content-Type'] = 'application/json';
const axiosOptions = {};
axios.defaults.withCredentials = true;
axios.defaults.baseURL = config.baseUrl;
const http: AxiosInstance = axios.create(axiosOptions);



const requestInterceptor = (request) => {
    console.log(`${request.method.toUpperCase()} to ${request.url}`);
    return request;
};

const responseInterceptor = (response) => {
    if (response.status === 200) {
        if (Object.keys(response.headers).includes('set-cookie')) {
            const setCookies = response.headers['set-cookie'].toString().split(',');
            for (let i = 0; i < setCookies.length; i++) {
                const cookiesNameValue = setCookies.toString().split(';')[0].toString().split('=');
                request.sessionUpdateSetCookie(cookiesNameValue[0], cookiesNameValue[1]);
            }

        }
    }
    return response;
};


http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use(responseInterceptor)



class Request {
    private testContext;
    private cookieString: string = '';
    private sessionUser = '';

    public async withSession(username: string, password: string) {
        this.cookieString = await getSessionCookieString(username, password);
        this.sessionUser = username;
    }

    public sessionUpdateSetCookie(name,value){
        this.cookieString = updateSessionCookieString(this.sessionUser,name,value);
    }

    public clearSession() {
        this.cookieString = '';
    }

    private getRequestConfig(headers: any) {
        let reqheaders: any = {};
        if (headers) {
            reqheaders = { ...headers };
        }
        if (this.cookieString !== '') {
            reqheaders['cookie'] = this.cookieString;
        }

        return { headers: reqheaders};
    }

    private getResponseFromError(error): any {
        console.log('error occured : ', error);
        if ( error.response) {
            return error.response;
        } else if (error.request) {
            return error.request;
        } else {
            return error;
        }
    }

    public async get(reqpath: string, headers: any, expectedStatus:any){
        reporterMsg('<<-----------------------------------------------------');
        reporterMsg(`GET : ${reqpath}`);
        reporterMsg('----------------------------------------------------->>');

        return await this.retryRequest(() => http.get(reqpath, this.getRequestConfig(headers)), expectedStatus);

    }

    public async post(reqpath: string, data, headers: any, expectedStatus: number) {
        reporterMsg('<<-----------------------------------------------------');
        reporterMsg(`POST : ${reqpath}`);
        reporterJson(data);
        reporterMsg('----------------------------------------------------->>');

        return await this.retryRequest(() => http.post(reqpath, data, this.getRequestConfig(headers)), expectedStatus);

    }

    public async put(reqpath: string, data, headers: any, expectedStatus: number){
        reporterMsg('<<-----------------------------------------------------');
        reporterMsg(`PUT : ${reqpath}`);
        reporterJson(data);
        reporterMsg('----------------------------------------------------->>');

        return await this.retryRequest(() => http.put(reqpath, data, this.getRequestConfig(headers)), expectedStatus);

    }


    public async delete(reqpath: string, payload, moreHeaders: any, expectedStatus:any) {
        reporterMsg('<<-----------------------------------------------------');
        reporterMsg(`DELETE : ${reqpath}`);
        reporterJson(payload);
        reporterMsg('----------------------------------------------------->>');

        const requestConfig = this.getRequestConfig(moreHeaders);
        if (payload) {
            requestConfig['data'] = payload;
        }
        return await this.retryRequest(() => http.delete(reqpath , requestConfig), expectedStatus);
    }

    async retryRequest(callback,expectedResponsecode){
        let retryAttemptCounter = 0;
        let isCallbackSuccess = false;
        let retVal = null;

        const retryErrorLogs = [];
        let error = null;
        let isExpectedResponseReceived = false
        while (retryAttemptCounter < 3 && !isExpectedResponseReceived){
            retryAttemptCounter++;
            isExpectedResponseReceived = false;
            retVal = null;
            error = null;
            try {
                retVal = await callback();
                reporterMsg(`Response: Status code ${retVal.status}`); 
            } catch (err) {
                // retryErrorLogs.push(err.response ? err.response : err);
                error = err;
                retVal = err.response ? err.response : null; 
                
            }
            

            if (retVal && expectedResponsecode instanceof Array){
                isExpectedResponseReceived = expectedResponsecode.includes(retVal.status); 
            } else if (retVal){
                isExpectedResponseReceived = expectedResponsecode === retVal.status 
            }

            if (!isExpectedResponseReceived){
                // console.log(retVal);
                // console.log(error);
                const status = retVal  ? retVal.status : "unknown";
                const responseBody = retVal  ? retVal.data : "unknown"; 
                let errorMessage = retVal ? `STATUS CODE : ${status} =>RESPONSE BODY :  ${JSON.stringify(responseBody)}` : `unknown request error occured ${error} ` 
                retryErrorLogs.push(`\n Retry ${retryAttemptCounter  } : ${errorMessage}`);
                reporterMsg('<<-------------------- ERROR RESPONSE---------------------------------');
                reporterMsg(` Unexpected response : ${errorMessage}`);
                reporterMsg('-------------------- ERROR RESPONSE--------------------------------->>');

                reporterMsg(` Retrying atempt ${retryAttemptCounter}`);
                // console.log(` Unexpected response : ${errorMessage}`);
                // console.log(` Retrying atempt ${retryAttemptCounter}`);

                let sleepInSec = retryAttemptCounter * (status === 502 ? 20 : 2); 
                await new Promise((resolve,reject) => {
                    setTimeout(() => {
                        reporterMsg(` <<<<<<<<<<<< Sleep for ${sleepInSec} sec before retry`);
                        resolve(true);
                    }, sleepInSec);
                });
            } 
            
        }

        if (isExpectedResponseReceived){
            return retVal;
        }else{
            throw new Error("Following errors occured in retry attempts "+(retryErrorLogs));
        }
    }
}
const request = new Request();
export default request;

