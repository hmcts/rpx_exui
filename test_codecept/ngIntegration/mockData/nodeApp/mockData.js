const nodeAppDataModel = require('../../../dataModels/nodeApp');

const testData = require('../../../e2e/config/appTestConfig');
const userUtil = require('../../util/userRole');
const baseConfig = require('../../config/baseConfig')
class NodeAppMockData {

    constructor(){

    }

    init(){
        const roles = ['task-supervisor', 'case-allocator', 'caseworker', 'caseworker-ia', 'caseworker-ia-caseofficer', 'task-supervisor', 'case-allocator'];
        this.userDetails = this.getUserDetailsWithRoles(roles); 
    }

    getMockLoginUserWithidentifierAndRoles(useridentifier, roles){
        const testUserIdamId = testData.users[testData.testEnv].filter(testUser => testUser.userIdentifier === useridentifier)[0];
        if (!testUserIdamId) {
            throw new Error("Provided user identifer is not configured in test data. " + releaseUer);
        }

        const userIdamID = testUserIdamId.idamId;

        roles = roles.split(",");
        if (userUtil.getUserRoleType(roles) === 'LEGAL_OPS') {
            // workallocationMockData.addCaseworkerWithIdamId(userIdamID, "IA");
        }
        const userDetails = this.setUserDetailsWithRolesAndIdamId(roles, userIdamID);
        return userDetails;
    }

    getConfigurationValue(configurationKey) {
        return configurations[configurationKey];
    }

    getUserDetailsWithRoles(roles) {
        const userDetails = nodeAppDataModel.getUserDetails_oidc();
        userDetails.userInfo.roles = roles;
        userDetails.userInfo.roleCategory = this.getUserRoleType(roles);
        this.userDetails = userDetails;
 
        return userDetails;
    }

    setUserDetailsWithRolesAndIdamId(roles,idamId) {
        const userDetails = nodeAppDataModel.getUserDetails_oidc();
        userDetails.userInfo.roles = roles;
        userDetails.userInfo.id = idamId;
        userDetails.userInfo.uid = idamId;
        userDetails.userInfo.roleCategory = this.getUserRoleType(roles);
        this.userDetails = userDetails; 

        return userDetails;
    }

    getUserRoleType(roles) {
        let roleType = '';
        for (const role of roles) {
            if (role.includes('pui-case-manager')) {
                roleType = 'SOLICITOR';
                break;
            } else if (role.includes('judge')) {
                roleType = 'JUDICIAL';
                break;
            }
        }

        return roleType !== '' ? roleType : 'LEGAL_OPS'
    }

    getUIConfiguration() {
        return {
            "accessManagementEnabled":true,
            "googleAnalyticsKey": "UA-124734893-4",
            "idamWeb": "https://idam-web-public.aat.platform.hmcts.net",
            "launchDarklyClientId": "5de6610b23ce5408280f2268",
            "manageCaseLink": "https://xui-webapp-aat.service.core-compute-aat.internal/cases",
            "manageOrgLink": "https://xui-mo-webapp-aat.service.core-compute-aat.internal",
            "protocol": "http",
            "ccdGatewayUrl":"http://localhost:3001",
            "headerConfig": baseConfig
        };
    }

    getUserDetailsTemplate() {
        return {
            "canShareCases": true,
            "sessionTimeout": {
                "idleModalDisplayTime": 10,
                "pattern": "-solicitor",
                "totalIdleTime": 50
            },
            "userInfo": {
                "id": "02d1f898-4109-4a28-a978-2ba14f42de22",
                "forename": "Luke",
                "surname": "Wilson",
                "email": "lukesuperuserxui_new@mailnesia.com",
                "active": true,
                "roles": [
                    "caseworker-ia-caseofficer",
                    "caseworker",
                    "caseworker-divorce",
                    "caseworker-divorce-financialremedy",
                    "caseworker-divorce-financialremedy-solicitor",
                    "caseworker-divorce-solicitor",
                    "caseworker-ia",
                    "caseworker-ia-legalrep-solicitor",
                    "caseworker-probate",
                    "caseworker-probate-authoriser",
                    "caseworker-probate-solicitor",
                    "caseworker-publiclaw",
                    "caseworker-publiclaw-solicitor",
                    "payments",
                    "pui-caa",
                    "pui-case-manager",
                    "pui-finance-manager",
                    "pui-organisation-manager",
                    "pui-user-manager"
                ]
            }
        };
    }
}



const configurations = {
    'feature.termsAndConditionsEnabled': false,
    'termsAndConditionsEnabled': false

}

module.exports = new NodeAppMockData();

