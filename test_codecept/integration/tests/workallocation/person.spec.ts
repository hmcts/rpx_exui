import { expect } from 'chai';
// import mocha from 'mocha';
import { config } from '../config/config';
import { getXSRFToken } from '../utils/authUtil';
import { setTestContext } from '../utils/helper';
import Request from '../utils/request';


const workAllocationDataModels = require('../../../dataModels/workAllocation');

describe('Work allocation Release 2: persons, caseworkers and judicial users', () => {
    const caseOfficer = config.users[config.testEnv].caseOfficer_r2.e;
    const caseofficerPass = config.users[config.testEnv].caseOfficer_r2.sec;

    beforeEach(function () {
        setTestContext(this);
        Request.clearSession();
    });


    it('Retrieve all case workers', async function () {
        this.timeout(60000);
        await Request.withSession(caseOfficer, caseofficerPass);
        const xsrfToken = await getXSRFToken(caseOfficer, caseofficerPass);

        const reqBody = {
            serviceIds:['IA']
        };

        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
            'content-length': JSON.stringify(reqBody).length
        };

        const response = await Request.post(`workallocation/caseworker/getUsersByServiceName`, reqBody, headers, 200);
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');

        const expectedCases = workAllocationDataModels.getFindPersonObj();
        expect(response.data[0]).to.have.all.keys(['service','caseworkers']);
        expect(Object.keys(response.data[0].caseworkers[0])).to.have.members(Object.keys(expectedCases));

    });



    it('get judicial users', async function () {
        this.timeout(60000);
        await Request.withSession(caseOfficer, caseofficerPass);
        const xsrfToken = await getXSRFToken(caseOfficer, caseofficerPass);

        const reqBody = {
            services: ['IA'],
            userIds:[config.workallocation[config.testEnv].judgeUser.id]
        };

        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
            'content-length': JSON.stringify(reqBody).length
        };

        const response = await Request.post(`api/role-access/roles/getJudicialUsers`, reqBody, headers, 200);
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');

    });


    it('Find Person', async function () {
        this.timeout(60000);
        await Request.withSession(caseOfficer, caseofficerPass);
        const xsrfToken = await getXSRFToken(caseOfficer, caseofficerPass);

        const reqBody = {
            searchOptions : {
                services : ['IA'],
                searchTerm : 'Tom',
                userRole:'Judicial'
            }
        };

        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
            'content-length': JSON.stringify(reqBody).length
        };

        const response = await Request.post(`workallocation/findPerson`, reqBody, headers, 200);
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('array');

        const expectedCases = workAllocationDataModels.getFindPersonObj();
        expect(Object.keys(response.data[0])).to.have.all.keys(Object.keys(expectedCases));

    });

});


