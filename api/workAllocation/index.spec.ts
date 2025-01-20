import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { baseWorkAllocationTaskUrl, getTask, postTaskAction, searchTask, getTypesOfWork } from '.';
import { http } from '../lib/http';
import { mockTasks } from './taskTestData.spec';

chai.use(sinonChai);

describe('workAllocation', () => {
  const SUCCESS_RESPONSE = { status: 200, data: 'ok' };
  let sandbox: sinon.SinonSandbox;
  let next: any;
  let spy: any;
  let res: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    next = sandbox.spy();
    res = mockRes(SUCCESS_RESPONSE);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTask', () => {
    it('should make a get request and respond appropriately', async () => {
      spy = sandbox.stub(http, 'get').resolves(res);
      const req = mockReq({
        params: {
          taskId: '123456'
        }
      });
      const response = mockRes();
      await getTask(req, response, next);

      // Should have the correct URL.
      const args = spy.getCall(0).args;
      expect(args[0]).to.equal(`${baseWorkAllocationTaskUrl}/task/123456`);

      // Should have received the HTTP response. The get simply returns the data.
      // expect(response.send).to.have.been.calledWith(sinon.match(SUCCESS_RESPONSE));
    });

    it('should handle an exception being thrown', async () => {
      spy = sandbox.stub(http, 'get').resolves(res);
      const req = mockReq({
        params: {
          taskId: '123456'
        }
      });
      const response = mockRes();

      // Have the response throw an error.
      response.send.throws();

      await getTask(req, response, next);

      expect(next).to.have.been.calledWith();
    });
  });

  describe('getTypesOfWork', () => {
    it('should make a get request and respond appropriately', async () => {
      const typesOfWork = [
        {
          id: 'hearing_work',
          label: 'Hearing work'
        },
        {
          id: 'upper_tribunal',
          label: 'Upper Tribunal'
        },
        {
          id: 'routine_work',
          label: 'Routine work'
        },
        {
          id: 'decision_making_work',
          label: 'Decision-making work'
        },
        {
          id: 'applications',
          label: 'Applications'
        },
        {
          id: 'priority',
          label: 'Priority'
        },
        {
          id: 'access_requests',
          label: 'Access requests'
        },
        {
          id: 'error_management',
          label: 'Error management'
        }
      ];
      const response = {
        work_types: typesOfWork
      };
      const typesOfWorkResponse = typesOfWork.map((work) => ({ key: work.id, label: work.label }));
      res = mockRes({
        data: response
      });
      spy = sandbox.stub(http, 'get').resolves(res);
      const req = mockReq();
      await getTypesOfWork(req, res, next);

      // expect(res.status).to.have.been.calledWith(sinon.match(200));
      expect(res.send).to.have.been.calledWith(sinon.match(typesOfWorkResponse));
    });

    it('should handle an exception being thrown', async () => {
      spy = sandbox.stub(http, 'get').resolves(res);
      const req = mockReq({
        params: {
          taskId: '123456'
        }
      });
      const response = mockRes();

      // Have the response throw an error.
      response.send.throws();

      await getTask(req, response, next);

      expect(next).to.have.been.calledWith();
    });
  });

  describe('searchTask', () => {
    it('should make a post request and respond appropriately', async () => {
      spy = sandbox.stub(http, 'post').resolves(res);
      const req = mockReq({
        body: {
          searchRequest: {
            search_parameters: [],
            sorting_parameters: []
          },
          view: 'MyTasks'
        },
        session: {
          caseworkers: null
        }
      });
      const response = mockRes({
        data: mockTasks
      });
      await searchTask(req, response, next);
      // Should have the correct URL and the appropriate payload.
      const args = spy.getCall(0).args;
      expect(args[0]).to.equal(`${baseWorkAllocationTaskUrl}/task`);
      expect(args[1]).to.deep.equal({ search_parameters: [], sorting_parameters: [] });

      // Should have received the HTTP response. The search simply returns the data.
      expect(response.data.length).to.equal(3);
      expect(response.data[0].jurisdiction).to.equal('IA');
    });

    it('should make a post request with pagination and respond appropriately', async () => {
      spy = sandbox.stub(http, 'post').resolves(res);
      const req = mockReq({
        body: {
          searchRequest: {
            search_parameters: [],
            sorting_parameters: [],
            pagination_parameters: {
              page_size: 11,
              page_number: 3
            }
          },
          view: 'MyTasks'
        },
        session: {
          caseworkers: null
        }
      });
      const response = mockRes({
        data: mockTasks
      });
      await searchTask(req, response, next);
      // Should have the correct URL and the appropriate payload.
      const args = spy.getCall(0).args;
      expect(args[0]).to.equal(`${baseWorkAllocationTaskUrl}/task?first_result=22&max_results=11`);
      expect(args[1]).to.deep.equal({
        search_parameters: [],
        sorting_parameters: []
      });

      // Should have received the HTTP response. The search simply returns the data.
      expect(response.data.length).to.equal(3);
      expect(response.data[0].jurisdiction).to.equal('IA');
    });

    it('should handle an exception being thrown', async () => {
      spy = sandbox.stub(http, 'post').resolves(res);
      const req = mockReq({
        body: {
          search: 'criteria'
        }
      });
      const response = mockRes();

      // Have the response throw an error.
      response.send.throws();

      await searchTask(req, response, next);

      expect(next).to.have.been.calledWith();
    });
  });

  describe('postTaskAction', () => {
    it('should make a post request and respond appropriately', async () => {
      spy = sandbox.stub(http, 'post').resolves(res);
      const body = { assignee: { name: 'bob', id: 'bob01' } };
      const req = mockReq({
        body,
        params: {
          action: 'assign',
          taskId: '123456'
        }
      });
      const response = mockRes();
      await postTaskAction(req, response, next);

      // Should have the correct URL and the appropriate payload.
      const args = spy.getCall(0).args;
      expect(args[0]).to.equal(`${baseWorkAllocationTaskUrl}/task/123456/assign`);
      expect(args[1]).to.deep.equal(body);

      // Should have received the HTTP response. The search simply returns the data.
      expect(response.send).to.have.been.calledWith(sinon.match(SUCCESS_RESPONSE.data));
    });

    it('should handle an exception being thrown', async () => {
      spy = sandbox.stub(http, 'post').resolves(res);
      const body = { assignee: { name: 'bob', id: 'bob01' } };
      const req = mockReq({
        body,
        params: {
          action: 'assign',
          taskId: '123456'
        }
      });
      const response = mockRes();

      // Have the response throw an error.
      response.send.throws();

      await postTaskAction(req, response, next);

      expect(next).to.have.been.calledWith();
    });
  });
});
