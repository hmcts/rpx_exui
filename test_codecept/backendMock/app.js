

const express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const minimist = require('minimist');
const fs = require('fs');
const path = require('path')
const axios = require('axios');
const http = axios.create({})
axios.defaults.headers.common['Content-Type'] = 'application/json'

const taskApi = require('./services/task-management-api/routes')
const workTypeRoutes = require('./services/task-management-api/workTypeRoutes')


const locationRoutes = require('./services/rdLocation/routes')
const caseworkerRoutes = require('./services/rdCaseworker/routes')
const judicialRoutes = require('./services/rdJudicial/routes')

const roleAssignmentRoutes = require('./services/roleAssignments/routes')
const bookingRoutes = require('./services/roleAssignments/bookingRoutes')

const hearingRoutes = require('./services/hearings/routes')


const ccdRoutes = require('./services/ccd/routes')
const ccdApi = require('./services/ccd/index')

const caseAssignmentsRoutes = require('./services/caseAssignments/routes')
const prdOrganisationRoutes = require('./services/prdOrganisations/routes')

const prdCommondataroutes = require('./services/prd/routes')


const globalSearchRoutes = require('./services/globalSearch/routes')

const idamOpenId = require('./services/idam/routes')
const sessionRoutes = require('./services/session/routes')
const caseCategoriesndDOcumentsRoutes = require('./services/caseFileView/routes')
const evidenceManagementRoutes = require('./services/evidenceManagement/routes')
const workFlowRouter = require('./services/workFlow/routes')

const users = require('./services/users');
const userApiData = require('./services/userApiData');
class MockApp {

    constructor() {
        this.logMessageCallback = null;
        this.logJSONCallback = null;
        this.routesLogFile = `${__dirname}/RUNTIME_ROUTES.txt`;
        this.uniqueRoutesCalled = new Set();
    }


    init(clientPortStart) {
      
    }


    logRequestDetails(req) {
        this.logMessage(`${req.method} : ${req.originalUrl}`);
        if (req.method === 'POST' || req.method === 'PUT') {
            this.logJSON(req.body);
        }
    }

    getCookieFromRequest(req, cookieName) {
        const cookie = req.cookies[cookieName];
        this.scenarios[cookie] = this.scenarios[cookie] ? this.scenarios[cookie] : "";
        return cookie;
    }

    async startServer() {

        const app = express();
        app.disable('etag');
       

        app.use(bodyParser.urlencoded({ extended : false}));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(express.json({ type: '*/*'}));

        app.use((req,res,next) => {
            // console.log(`${req.method} : ${req.url}`);

            res.set('Cache-Control', 'no-store, s-maxage=0, max-age=0, must-revalidate, proxy-revalidate');
            const authToken = req.headers.authorization;
            if (authToken){
                const token = authToken.replace('Bearer ','')
                userApiData.logSessionRequest(token, req);

            }
            next();
        })

        app.use('/client', sessionRoutes)

        app.use('/', idamOpenId)
        app.use('/task', taskApi)
        app.use('/work-types', workTypeRoutes)
        app.use('/refdata/location', locationRoutes)
        app.use('/refdata/internal/staff', caseworkerRoutes )
        app.use('/refdata/judicial', judicialRoutes )


        app.use('/am/role-assignments', roleAssignmentRoutes)
        app.use('/am/bookings', bookingRoutes)

        app.use('/', hearingRoutes)

        app.use('/globalSearch', globalSearchRoutes)

        app.use('/case-assignments', caseAssignmentsRoutes)
        app.use('/refdata/external/v1/organisations',prdOrganisationRoutes )
        
        app.post('/searchCases', (req,res) => {
            const cases = ccdApi.getSearchCases(req,res)
            res.send(cases)
        })


        app.use('/', ccdRoutes )
        app.use('/refdata/commondata', prdCommondataroutes)
        app.use('/categoriesAndDocuments', caseCategoriesndDOcumentsRoutes)
        app.use('/cases/documents', evidenceManagementRoutes)
        app.use('/documentsv2', evidenceManagementRoutes)
        app.use('/workflow', workFlowRouter)


        app.get('/activity/cases/:caseId/activity', (req,res) => {
            res.send({})
        })


        app.post('/translation/cy', (req, res) => {
            const reqBody = req.body
            const savePhrasesPath = path.resolve(__dirname,'../../functional-output/translations.txt')
            const resposne = { translations:{}}
            for(const phrase of reqBody.phrases){
                fs.appendFileSync(savePhrasesPath, `\n${phrase}`)
                resposne.translations[phrase] = { translation: `WELSH[${phrase}]`}
            }

            res.send(resposne)
        })

        // await this.stopServer();
        this.server = await app.listen(8080);

        console.log("mock server started on port : " + 8080);
        // return "Mock started successfully"

    }

    async stopServer() {
        if (this.server) {
            await this.server.close();
            this.server = null;
            console.log("Mock server stopped");

        } else {
            console.log("Mock server is null or undefined");
        }
    }


}


const mockInstance = new MockApp();
module.exports = mockInstance;

const args = minimist(process.argv)
if (args.standalone) {
    // mockInstance.setServerPort(8080);
    mockInstance.init();
    // nodeAppMock.userDetails = nodeAppMock.getMockLoginUserWithidentifierAndRoles("IAC_CaseOfficer_R2", "caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator");
    // bookingsMockData.bookingResponse = [];
    // setUpcaseConfig();
    // getDLCaseConfig();
    // collectionDynamicListeventConfig()
    // createCustomCaseDetails();
    mockInstance.startServer()
}
