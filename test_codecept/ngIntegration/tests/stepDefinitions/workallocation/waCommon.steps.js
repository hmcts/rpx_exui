var { defineSupportCode } = require('cucumber');
const fs = require('fs')
const path = require('path')
const moment = require('moment');
const mockClient = require('../../../../backendMock/client/index');
const mockService = require('../../../../backendMock/client/serviceMock');

const roleAssignmentMock = require('../../../../backendMock/services/roleAssignments/index');

const MockApp = require('../../../../nodeMock/app');
const nodeAppMock = require('../../../mockData/nodeApp/mockData');

const waMockData = require('../../../mockData/workAllocation/mockData');

const headerPage = require('../../../../e2e/features/pageObjects/headerPage');
const SoftAssert = require('../../../util/softAssert');
const CucumberReporter = require('../../../../codeceptCommon/reportLogger');
const taskListPage = require('../../../../e2e/features/pageObjects/workAllocation/taskListPage');
const TaskListTable = require('../../../../e2e/features/pageObjects/workAllocation/taskListTable');
const BrowserUtil = require('../../../util/browserUtil');
const BrowserWaits = require('../../../../e2e/support/customWaits');

const workallocationMockData = require('../../../mockData/workAllocation/mockData');

const userRolesConfig = require('../../../../e2e/config/userRolesConfig');

const userUtil = require('../../../util/userRole');
const { DataTableArgument } = require('codeceptjs');

const loginPage = require('../../../../e2e/features/pageObjects/loginLogoutObjects');

    const taskListTable = new TaskListTable();

const testData = require('../../../../e2e/config/appTestConfig');

const idamLogin = require('../../../util/idamLogin');
const browser = require('../../../../codeceptCommon/browser');
const reportLogger = require('../../../../codeceptCommon/reportLogger');

let invalidCredentialsCounter = 0;
let testCounter = 0;
let firstAttemptFailedLogins = 0;

async function loginattemptCheckAndRelogin(username, password, world) {
    testCounter++;
    let loginAttemptRetryCounter = 1;
    const baseUrl = process.env.TEST_URL || 'http://localhost:3000/'

    await browser.get(baseUrl);
    await BrowserWaits.waitForElement(loginPage.emailAddress);

    let preLoginUrl = await browser.getCurrentUrl();
    await BrowserWaits.retryWithActionCallback(async () => {
        await loginPage.loginWithCredentials(username, password);

    })
    while (loginAttemptRetryCounter < 5) {
        let emailFieldValue = "";

        try {
            // await BrowserWaits.waitForstalenessOf(loginPage.emailAddress, 5);
            await BrowserWaits.waitForConditionAsync(async () => {
                const currentUrl = await browser.getCurrentUrl();
                return preLoginUrl !== currentUrl
            });
            await browser.sleep(2)
            const  currentUrl = await browser.getCurrentUrl();
            if (currentUrl.includes('idam')){
                preLoginUrl = await browser.getCurrentUrl();
                throw new Error('Login failed')
            }

            break;
        } catch (err) {
            if (!emailFieldValue.includes(username)) {
                // if (loginAttemptRetryCounter === 1) {
                //     firstAttemptFailedLogins++;
                // }
                // if (loginAttemptRetryCounter === 2) {
                //     secondAttemptFailedLogins++;
                // }


                console.log(err + " : Login re attempt " + loginAttemptRetryCounter);
                console.log(err);
                // await browser.driver.manage()
                //     .deleteAllCookies();
                // const baseUrl = process.env.TEST_URL || 'http://localhost:3000/'

                // await browser.get(baseUrl);
                await BrowserWaits.waitForElement(loginPage.emailAddress);
                await loginPage.loginWithCredentials(username, password);
                loginAttemptRetryCounter++;
            }
        }
    }
    // console.log("ONE ATTEMPT:  EUI-1856 issue occured / total logins => " + firstAttemptFailedLogins + " / ");

    // console.log("TWO ATTEMPT: EUI-1856 issue occured / total logins => " + secondAttemptFailedLogins + " / " );

}


    async function mockLoginWithRoles(roles, userIdentifier){
        const testUser = testData.users['aat'].filter(testUser => testUser.userIdentifier === userIdentifier)[0];
        let loginUser = '';
        if (userIdentifier){
            idamLogin.withCredentials(testUser.email, testUser.key)
            loginUser = testUser.email
        }else{
            idamLogin.withCredentials('lukesuperuserxui_new@mailnesia.com', 'Monday01')
            loginUser = 'lukesuperuserxui_new@mailnesia.com'
        }
        

        await browser.get('http://localhost:3000/get-help');
  

        let userDetails = null;
      
        await BrowserWaits.retryWithActionCallback(async () => {
            await idamLogin.do();
            userDetails = idamLogin.userDetailsResponse.details.data;
            const sessionUserName = userDetails.userInfo ? userDetails.userInfo.email : '';
            if (sessionUserName !== loginUser ){
                throw new Error('session not updated with user, retrying');
            }
            
        })

        await BrowserWaits.retryWithActionCallback(async () => {
            await browser.driver.manage().setCookies(idamLogin.xuiCallbackResponse.details.setCookies)
            await browser.get('http://localhost:3000/');

        })

        const authCookies = idamLogin.xuiCallbackResponse.details.setCookies
        const authCookie = authCookies.find(cookie => cookie.name === '__auth__')
        await browser.sleep(10)
        await mockClient.updateAuthSessionWithRoles(authCookie.value, roles)
        return await idamLogin.getUserDetails()

        // await browser.get('http://localhost:3000/');
    }

    Given('I set MOCK with {string} release user and roles', async function (releaseUer,datatableroles ) {

        const datatablehashes = datatableroles.hashes();
        const roles = datatablehashes.map(roleHash => roleHash.ROLE);

        await mockLoginWithRoles(roles)

    });

    Given('I set MOCK with {string} release user and roles {string}', async function (releaseUer, roles) {

        roles = roles.split(",");

        await  mockLoginWithRoles(roles)


    });

    Given('I set MOCK locations for release {string}', async function(release,locationsDatatbale){
        const locations = locationsDatatbale.hashes();
        let apiUrl = "/";
        if (release === "wa_release_1") {
            apiUrl = apiUrl + "workallocation";
        } else if (release === "wa_release_2") {
            apiUrl = apiUrl + "workallocation2";
        }

        MockApp.onGet(apiUrl+"/location", (req, res) => {
            res.send(locations);
        });
    });

    Given('I set MOCK location for person of type {string} in release {string}', async function (userType, release, locationDetailsDataTable) {
        const testUser = testData.users[testData.testEnv].filter(testUser => testUser.release === release)[0];
        if (!testUser) {
            throw new Error("Provided release user is not configured in test data. " + release);
        }

        let apiUrl = "/";
        if (release === "wa_release_1"){
            apiUrl = apiUrl+"workallocation";
        } else if (release === "wa_release_2") {
            apiUrl = apiUrl + "workallocation2";
        }

        if (userType === "caseworker"){
            apiUrl = apiUrl + "/caseworker";
        }else if (userType === "judge") {
            apiUrl = apiUrl + "/judge";
        }
        const persons = waMockData.getPersonList(80);
        const locationInputDetails = locationDetailsdatatable.parse().hashes()[0];

        persons[0].idamId = testUser.idamId;
        persons[0].location.id = locationInputDetails.id;
        persons[0].location.locationName = locationInputDetails.locationName
        MockApp.onGet(apiUrl, (req, res) => {
            res.send(persons);
        });

    });


    When('I set MOCK with user roles', async function (rolesTable) {
        const roles = [];
        const rolesTablerows = rolesTable.parse().rows();
        for (const row of rolesTablerows) {
            roles.push(row[0]);
        }
        await mockLoginWithRoles(roles)

    });

    Given('I set MOCK with user {string} and roles {string} with reference {string}', async function (useridentifier, roles,mockUserRef) {
      const userDetails = await mockLoginWithRoles(roles.split(','))
      global.scenarioData[mockUserRef] = userDetails;
      const auth = await browser.driver.manage().getCookie('__auth__')
      await mockClient.setUserApiData(auth,'', {status: 200, data: global.scenarioData[mockUserRef]});
    });


    Given('I set MOCK with user {string} and userInfo with roles {string} with reference {string}', async function (useridentifier,roles ,mockUserRef, datatable) {
        const userDetails = await mockLoginWithRoles(roles.split(','))
        const rows = datatable.parse().hashes();
        const properties = rows[0];
        for (const key of Object.keys(properties)) {
            userDetails.userInfo[key] = properties[key]
        }
        global.scenarioData[mockUserRef] = userDetails;
        const auth = await browser.driver.manage().getCookie('__auth__')
        await mockClient.updateAuthSessionWithUserInfo(auth.value, userDetails.userInfo);
    });

    Given('I set MOCK with user details', async function (datatable) {
        CucumberReporter.reportDatatable(datatable)
        const rowsHash = datatable.parse().rowsHash()
        const userDetails = await mockLoginWithRoles(rowsHash.roles.split(','))
        const properties = rowsHash;
        for (const key of Object.keys(properties)) {
            if(key === 'roles'){
                userDetails.userInfo[key] = properties[key].split(',').map(v => v.trim())
            }else{
                userDetails.userInfo[key] = properties[key]
            }
            
        }
        const auth = await browser.driver.manage().getCookie('__auth__')
        await mockClient.updateAuthSessionWithUserInfo(auth.value, userDetails.userInfo);
    });


     Given('I set MOCK with user details with user identifier {string}', async function (userIdentifier, datatable) {
        CucumberReporter.reportDatatable(datatable)
        const rowsHash = datatable.parse().rowsHash()
         const userDetails = await mockLoginWithRoles(rowsHash.roles.split(','), userIdentifier)
        const properties = rowsHash;
        for (const key of Object.keys(properties)) {
            if(key === 'roles'){
                userDetails.userInfo[key] = properties[key].split(',').map(v => v.trim())
            }else{
                userDetails.userInfo[key] = properties[key]
            }
            
        }
        const auth = await browser.driver.manage().getCookie('__auth__')
        await mockClient.updateAuthSessionWithUserInfo(auth.value, userDetails.userInfo);
    });



    Given('I add roleAssignmentInfo to MOCK user with reference {string}', async function(userDetailsRef, roleAssignments){
        const boolAttributes = ['isCaseAllocator','bookable'];
        const userDetails = global.scenarioData[userDetailsRef];
        const roleAssignmentArr = [];
        for (let roleAssignment of roleAssignments.hashes()){
            const roleKeys = Object.keys(roleAssignment);

            boolAttributes.forEach(attr => {
                if (roleKeys.includes(attr)){
                    roleAssignment[attr] = roleAssignment[attr] === "true";
                }
            })

            roleAssignmentArr.push(roleAssignment);
        }
        userDetails.roleAssignmentInfo.push(...roleAssignmentArr);
    });

    Given('I set Mock user with ref {string}, reset role assignments', async function (userDetailsRef){
        // const userDetails = global.scenarioData[userDetailsRef];
        // userDetails.roleAssignmentInfo =[];

    });

    async function addRoleAssignmentsWithOrgRolesForServices(userDetailsRef, services, roleAttributesDataTable){
        // const userDetails = global.scenarioData[userDetailsRef];
        const roleAssignmentArr = [];
        const roleAttributes = roleAttributesDataTable.parse().rowsHash()
        const boolAttributes = []
        for (const service of services.split(",")) {
            const roleAssignmentTemplate = roleAssignmentMock.getRoleAssignmentTemplate();
            roleAssignmentTemplate.attributes['jurisdiction'] = service;
            const roleKeys = Object.keys(roleAttributes);

            const attributeProperties = ['jurisdiction', 'substantive', 'caseType', 'caseId', 'baseLocation', 'primaryLocation']

            for (const attr of roleKeys) {
                const value = boolAttributes.includes(attr) ? roleAssignmentTemplate[attr].includes('Y') : roleAttributes[attr]; //correction may be needed
                if (attributeProperties.includes(attr)) {
                    roleAssignmentTemplate.attributes[attr] = value;
                } else {
                    roleAssignmentTemplate[attr] = value;

                }
            }

            roleAssignmentArr.push(roleAssignmentTemplate);

        }

        const authCookies = await browser.driver.manage().getCookies()
        const authCookie = authCookies.find(cookie => cookie.name === '__auth__')
        const sessionRoleAssignments = await mockClient.updateAuthSessionWithRoleAssignments(authCookie.value, roleAssignmentArr);
        reportLogger.AddJson(sessionRoleAssignments.data);
        await browser.get('http://localhost:3000')
    }


    Given('I set Mock user with ref {string}, ORGANISATION roles for services {string}', async function (userDetailsRef, services, roleAttributesDataTable){
        if (services === ''){
            return;
        }
        await addRoleAssignmentsWithOrgRolesForServices(userDetailsRef, services, roleAttributesDataTable)
    });

    Given('I set Mock user with ref {string}, ORGANISATION roles for services {string} allow empty service', async function (userDetailsRef, services, roleAttributesDataTable) {
        await addRoleAssignmentsWithOrgRolesForServices(userDetailsRef, services, roleAttributesDataTable)
    });


    Given('I set MOCK user with reference {string} roleAssignmentInfo', async function (userDetailsRef, roleAssignments) {
        reportLogger.reportDatatable(roleAssignments)
        const boolAttributes = ['isCaseAllocator','contractType', 'bookable'];
        const roleAssignmentArr = [];
        for (const roleAssignment of roleAssignments.parse().hashes()) {
            const roleAssignmentTemplate = roleAssignmentMock.getRoleAssignmentTemplate();
            const roleKeys = Object.keys(roleAssignment);

            const attributeProperties = ['jurisdiction', 'substantive', 'caseType', 'caseId', 'baseLocation', 'primaryLocation', 'bookable','specificAccessReason']

            for(const attr of roleKeys){
                const value =  boolAttributes.includes(attr) ? roleAssignment[attr].includes('true') : roleAssignment[attr];
                if (attributeProperties.includes(attr) && value !== ''){
                    roleAssignmentTemplate.attributes[attr] = value;
                }else{
                    roleAssignmentTemplate[attr] = value;

                }
            }

            roleAssignmentArr.push(roleAssignmentTemplate);
        }

        const cookies = await browser.driver.manage().getCookies();
        const authCookie = cookies.find(cookie => cookie.name === '__auth__')


        await BrowserWaits.retryWithActionCallback(async () => {
            await mockClient.updateAuthSessionWithRoleAssignments(authCookie.value, roleAssignmentArr );

            const userDetails = await idamLogin.getUserDetails();
            if (!userDetails.roleAssignmentInfo.length >= roleAssignmentArr.length) {
                reportLogger.AddMessage(`Mock role assignments not updated in user session. Retrying user session update`);
                throw new Error('Mock role assignments not updated');
            }
        })

        const userDetails = await idamLogin.getUserDetails();
        CucumberReporter.AddJson(userDetails.roleAssignmentInfo);
        await browser.get(await browser.getCurrentUrl());

    });



    Given('I set MOCK roleAssignments', async function (roleAssignments) {
        reportLogger.reportDatatable(roleAssignments)
        const boolAttributes = ['isCaseAllocator','contractType', 'bookable'];
        const roleAssignmentArr = [];
        for (const roleAssignment of roleAssignments.parse().hashes()) {
            const roleAssignmentTemplate = roleAssignmentMock.getRoleAssignmentTemplate();
            const roleKeys = Object.keys(roleAssignment);

            const attributeProperties = ['jurisdiction', 'substantive', 'caseType', 'caseId', 'baseLocation', 'primaryLocation', 'bookable','notes']

            for(const attr of roleKeys){
                const value =  boolAttributes.includes(attr) ? roleAssignment[attr].includes('true') : roleAssignment[attr];
                if (attributeProperties.includes(attr) && value !== ''){
                    roleAssignmentTemplate.attributes[attr] = value;
                } else if (attr.includes('beginTime') || attr.includes('endTime') || attr.includes('created')) {
                    const valInt = parseInt(value)
                    roleAssignmentTemplate[attr] = valInt >= 0 ? moment().add(valInt, 'days').valueOf() : moment().subtract(valInt*-1, 'days').valueOf()
                } else{
                    roleAssignmentTemplate[attr] = value;

                }
            }

            roleAssignmentArr.push(roleAssignmentTemplate);
        }

        await mockService.addRoleAssignments(roleAssignmentArr);

    });

    Given('I set MOCK with user identifer {string} role type {string} and role identifiers {string}', async function (useridentifier,roleType ,roleIdentifiers) {
        const roles = [];
        const testUserIdamId = testData.users[testData.testEnv].filter(testUser => testUser.userIdentifier === useridentifier)[0];
        if (!testUserIdamId) {
            throw new Error("Provided user identifer is not configured in test data. " + useridentifier);
        }

        const userIdamID = testUserIdamId.idamId;

        const rolesIdentifiersArr = roleIdentifiers.split(",");
        const roleidentifersForRoleType = userRolesConfig[roleType.toLowerCase()];
        if (!roleidentifersForRoleType){
            throw new Error(`Role type not recognized ${roleType}`);
        }

        for (const roleIdentifier of rolesIdentifiersArr){
            const rolesForIdentifier = roleidentifersForRoleType[roleIdentifier];
            if (!rolesForIdentifier) {
                throw new Error(`Role identifer not recognized ${roleType} ${roleIdentifier}`);
            }
            roles.push(...rolesForIdentifier);
        }
        const userDetails = nodeAppMock.setUserDetailsWithRolesAndIdamId(roles, userIdamID);
        // if (userUtil.getUserRoleType(roles) === 'LEGAL_OPS') {
        //     workallocationMockData.addCaseworkerWithIdamId(userIdamID, "IA");
        // }
        await mockLoginWithRoles(roles)

    });

    Then('I validate primary navigation tabs for user {string} in release {string}', async function(userType, release){
        await BrowserUtil.stepWithRetry(async () => {
            const softAssert = new SoftAssert(this);
            const tabsExpected = testData.appFeatures.primaryTabs[userType][release];
            const tabsActual = await headerPage.getPrimaryTabsDisplayed();
            for (let i = 0; i < tabsExpected.length; i++) {
                let tabExpected = tabsExpected[i];
                softAssert.setScenario("Is tab displayed " + tabExpected);
                await softAssert.assert(async () => expect(tabsActual.includes(tabExpected), `${tabExpected} is not displayed for ${userType} in release ${release} : Actual ${tabsActual}`).to.be.true);
            }

            await softAssert.assert(async () => expect(tabsActual.length, `Expected and actuals tabs dsplayed does not match:\n expected${tabsExpected}\n actual ${tabsActual} `).to.equal(tabsExpected.length));
            softAssert.finally();
        });
    });

    Then('I validate primary navigation main items for user {string} in release {string}', async function (userType, release) {
        await BrowserUtil.stepWithRetry(async () => {
            const softAssert = new SoftAssert(this);
            const tabsExpected = testData.appFeatures.primaryTabsMainItems[userType][release];
            const tabsActual = await headerPage.getPrimaryTabsDisplayed();
            for (let i = 0; i < tabsExpected.length; i++) {
                let tabExpected = tabsExpected[i];
                softAssert.setScenario("Is tab displayed " + tabExpected);
                await softAssert.assert(async () => expect(tabsActual.includes(tabExpected), `${tabExpected} is not displayed for ${userType} in release ${release} : Actual ${tabsActual}`).to.be.true);
            }

            await softAssert.assert(async () => expect(tabsActual.length, `Expected and actuals tabs dsplayed does not match:\n expected${tabsExpected}\n actual ${tabsActual} `).to.equal(tabsExpected.length));
            softAssert.finally();
        });
    });

    Then('I validate primary navigation right side items for user {string} in release {string}', async function (userType, release) {
        await BrowserUtil.stepWithRetry(async () => {
            const softAssert = new SoftAssert(this);
            const tabsExpected = testData.appFeatures.primaryTabsRightSideItems[userType][release];
            const tabsActual = await headerPage.getPrimaryTabsDisplayed();
            for (let i = 0; i < tabsExpected.length; i++) {
                let tabExpected = tabsExpected[i];
                softAssert.setScenario("Is tab displayed " + tabExpected);
                await softAssert.assert(async () => expect(tabsActual.includes(tabExpected), `${tabExpected} is not displayed for ${userType} in release ${release} : Actual ${tabsActual}`).to.be.true);
            }

            await softAssert.assert(async () => expect(tabsActual.length, `Expected and actuals tabs dsplayed does not match:\n expected${tabsExpected}\n actual ${tabsActual} `).to.equal(tabsExpected.length));
            softAssert.finally();
        });
    });

    Then('I validate task list column displayed for user {string} in release {string}', async function(user, release){
        await BrowserWaits.waitForSeconds(20);
        await BrowserUtil.stepWithRetry(async () => {
            const softAssert = new SoftAssert(this);
            const taskListColumnsExpected = testData.appFeatures.taskListColumns.myTasks[release];
            const taskListColumnsActual = await taskListTable.getColumnHeaderNames();

            for (let i = 0; i < taskListColumnsExpected.length; i++) {
                let columnExpected = taskListColumnsExpected[i];
                softAssert.setScenario("Is column displayed " + columnExpected);
                await softAssert.assert(async () => expect(taskListColumnsActual.includes(columnExpected), `${columnExpected} is not displayed for ${user} in release ${release} : Actual ${taskListColumnsActual}`).to.be.true);

            }
            softAssert.setScenario("Columns displayed ");
            await softAssert.assert(async () => expect(taskListColumnsActual.length, `for ${user} in release ${release} \n Expected and actuals column dsplayed does not match:\n expected${taskListColumnsExpected}\n actual ${taskListColumnsActual} `).to.equal(taskListColumnsExpected.length));

            softAssert.finally();
            await CucumberReporter.AddScreenshot();
        });
    });

    Then('I validate available task list column displayed for user {string} in release {string}', async function (userType, release) {
        await BrowserUtil.stepWithRetry(async () => {
            const softAssert = new SoftAssert(this);
            const taskListColumnsExpected = testData.appFeatures.taskListColumns.availableTasks[release];
            const taskListColumnsActual = await taskListTable.getColumnHeaderNames();

            for (let i = 0; i < taskListColumnsExpected.length; i++) {
                let columnExpected = taskListColumnsExpected[i];
                softAssert.setScenario("Is column displayed " + columnExpected);
                await softAssert.assert(async () => expect(taskListColumnsActual.includes(columnExpected), `${columnExpected} is not displayed for ${userType} in release ${release} : Actual ${taskListColumnsActual}`).to.be.true);
            }

            await softAssert.assert(async () => expect(taskListColumnsActual.length, `Expected and actuals column dsplayed does not match:\n expected${taskListColumnsExpected}\n actual ${taskListColumnsActual} `).to.equal(taskListColumnsExpected.length))
            softAssert.finally();
        });
    });

    Then('I validate task request body in reference {string} has locations set', async function(reference, locationsDatatable){
       const reqBody = global.scenarioData[reference];
       return "Pending";

    });

    Given('I clear all MOCK location', function(){
        workallocationMockData.locationsByServices = [];
    })

    Given('I set MOCK locations with names in service {string}', async function(service, locationNamesDatatable){
        const locationNamesHashes = locationNamesDatatable.parse().hashes();
        const locationNames = [];
        for (const locationNameHash of locationNamesHashes){
            locationNames.push({ locationName: locationNameHash.locationName, id: locationNameHash.id});
        }

        const locationsArray = workallocationMockData.getLocationsWithNames(locationNames);

        let locationForThisService = { service: service, locations: [] }
        locationForThisService.locations.push(...locationsArray);
        workallocationMockData.locationsByServices.push(locationForThisService)

    });

    Given('I set MOCK person with user {string} and roles {string}', async function(userIdentifier, roles, datatable){
        const rolesArr = roles.split(",");
        const testUserIdamId = testData.users[testData.testEnv].filter(testUser => testUser.userIdentifier === userIdentifier)[0];

        const datatablehashes = datatable.parse().hashes();
        const locationId = datatablehashes[0].locationId
        const locationName = datatablehashes[0].locationName

        const roleCategory = userUtil.getUserRoleType(rolesArr);
        let person = null;
        if (roleCategory === "LEGAL_OPS"){
            person = workallocationMockData.addCaseworkerWithIdamId(testUserIdamId.idamId,'IA')
            person.location.id = locationId;
            person.location.locationName = locationName;

        } else if (roleCategory === "JUDICIAL"){
            person = workallocationMockData.addJudgeUsers(testUserIdamId.idamId,'testMockUserFN','test','testjudge@hmcts.net')
            person.appointments[0].location_id = locationId;
            person.appointments[0].base_location_id = locationId;
            person.appointments[0].court_name = locationName;


        }
        CucumberReporter.AddMessage(`For roles "${roles}" Person of type "${roleCategory} is added"`);
        CucumberReporter.AddJson(person);
    });


Given('I set role assignment query response', async function (roleAssignments){
        reportLogger.reportDatatable(roleAssignments)
        const boolAttributes = ['isCaseAllocator', 'contractType', 'bookable'];
        const roleAssignmentArr = [];
        for (const roleAssignment of roleAssignments.parse().hashes()) {

            const roleAssignmentTemplate = roleAssignmentMock.getRoleAssignmentTemplate();
            const roleKeys = Object.keys(roleAssignment);

            const attributeProperties = ['jurisdiction', 'substantive', 'caseType', 'caseId', 'baseLocation', 'primaryLocation', 'bookable','specificAccessReason']

            for (const attr of roleKeys) {
                const value = boolAttributes.includes(attr) ? roleAssignment[attr].includes('true') : roleAssignment[attr];
                if (attributeProperties.includes(attr) && value !== '') {
                    roleAssignmentTemplate.attributes[attr] = value;
                } else {
                    roleAssignmentTemplate[attr] = value;

                }
            }

            roleAssignmentArr.push(roleAssignmentTemplate);
        }

    await mockService.setRoleAssignmentsQuery({ roleAssignmentResponse: roleAssignmentArr },200)

    })

