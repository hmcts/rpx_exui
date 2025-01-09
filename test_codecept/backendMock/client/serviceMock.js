

const client = require('./index')
const reportLogger = require('../../codeceptCommon/reportLogger')

class ServiceMock{

    async getAuthToken(){
        const authCookie = await browser.driver.manage().getCookie('__auth__');
        return authCookie.value
    }

    async updateMockServer(apiMethod, response){
        const authToken = await this.getAuthToken()
        return await client.setUserApiData(authToken, apiMethod, response)
    }

    async getRequestBodyForApiMethod(apiMethod){
        const authToken = await this.getAuthToken()
        return await client.getRequestBody(authToken, apiMethod)
    }

    async updateCaseData(data, status){
        const res = await this.updateMockServer('OnCaseDetails', { status: status ? status:200, data: data });
        reportLogger.AddMessage(`Case data updated to mock, Status code ${res.status}`)
    }

    async updateSearchForCompletableTasks(data, status){
        await this.updateMockServer('OnSearchForCompletableTasks', { status: status ? status : 200, data: data });
    }

    async setBookings(data, status) {
        await this.updateMockServer('OnBookings', { status: status ? status : 200, data: data });
    }

    async setlocations(data,status){
        await this.updateMockServer('onServiceLocations', { status: status ? status : 200, data: data } )
    }

    async setCaseHearings(data, status) {
        await this.updateMockServer('OnCaseHearings', { status: status ? status : 200, data: data })
    }

    async setOnGetHearing(data, status) {
        await this.updateMockServer('OnGetHearing', { status: status ? status : 200, data: data })
    }

    async setHearingServiceHearingValues(data, status){
        await this.updateMockServer('OnServiceHearingValues', { status: status ? status : 200, data: data })
    }


    async addRoleAssignments(data) {
        await this.updateMockServer('AddMockRoleAssignments', { status: 200, data: data })
    }



}

module.exports =  new ServiceMock()
