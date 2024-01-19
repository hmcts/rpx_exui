import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
// import mocha from 'mocha';
import { config } from './config/config';
import { getUserId, getXSRFToken } from './utils/authUtil';
import { setTestContext } from './utils/helper';
import Request from './utils/request';

describe('Evidence Manager Endpoints', () => {
  const userName = config.users[config.testEnv].solicitor.e;
  const password = config.users[config.testEnv].solicitor.sec;

  // const userName = 'peterxuisuperuser@mailnesia.com';
  // const password = 'Monday01';
  beforeEach(function() {
    this.timeout(120000);

    setTestContext(this);
    Request.clearSession();
  });

  it('Get document binary', async function() {
    await Request.withSession(userName, password);
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      experimental: true,
      'X-XSRF-TOKEN': xsrfToken
    };
    const response = await Request.get(`documents/${config.em[config.testEnv].docId}/binary`, headers, 200);
    expect(response.status).to.equal(200);
  });

  it('Get document annotations metadata', async () => {
    await Request.withSession(userName, password);
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      experimental: true,
      'X-XSRF-TOKEN': xsrfToken
    };
    const response = await Request.get(`em-anno/metadata/${config.em[config.testEnv].docId}`, headers, [200, 204]);
    expect(response.status).to.equal(204);
  });

  // it('Get document annotations filter', async () => {
  //   await Request.withSession(userName, password);
  //   const xsrfToken = await getXSRFToken(userName, password);
  //   const headers = {
  //     experimental: true,
  //     'X-XSRF-TOKEN': xsrfToken
  //   };
  //   const response = await Request.get(`em-anno/annotation-sets/filter?documentId=${config.em[config.testEnv].docId}`, null, 200);
  //   expect(response.status).to.equal(200);
  //   expect(response.data).to.have.all.keys('createdBy', 'createdByDetails', 'lastModifiedByDetails', 'createdDate', 'lastModifiedBy', 'annotations', 'documentId', 'id', 'lastModifiedDate');
  // });

  it('Put document annotation', async () => {
    await Request.withSession(userName, password);
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      'X-XSRF-TOKEN': xsrfToken
    };
    const response = await Request.put('em-anno/annotations', await getAnnotationObject(), headers, 200);
    expect(response.status).to.equal(200);
  });

  it('Delete document annotation', async () => {
    await Request.withSession(userName, password);
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      'X-XSRF-TOKEN': xsrfToken
    };
    const annotationsRes = await Request.get(`em-anno/annotation-sets/filter?documentId=${config.em[config.testEnv].docId}`, null, 200);
    let annoIdToDelete = '';
    if (annotationsRes.data.annotations.length <= 1) {
      const newannoRes = await Request.put('em-anno/annotations', await getAnnotationObject(), headers, 200);
      expect(newannoRes.status).to.equal(200);

      annoIdToDelete = newannoRes.data.annotations[0].id;
    } else {
      annoIdToDelete = annotationsRes.data.annotations[0].id;
    }
    const response = await Request.delete(`em-anno/annotations/${annoIdToDelete}`, await getAnnotationObject(), headers, 200);
    expect(response.status).to.equal(200);
  });

  it('Get document bookmarks', async () => {
    await Request.withSession(userName, password);
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      experimental: true,
      'X-XSRF-TOKEN': xsrfToken
    };
    const response = await Request.get(`em-anno/${config.em[config.testEnv].docId}/bookmarks`, null, 200);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');

    expect(response.data[0]).to.have.all.keys('id', 'name', 'documentId', 'createdBy', 'pageNumber', 'xCoordinate', 'yCoordinate', 'parent', 'previous');
    expect(response.data[0].documentId).to.equal(config.em[config.testEnv].docId);
  });

  it('Put document bookmark', async () => {
    await Request.withSession(userName, password);

    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      'X-XSRF-TOKEN': xsrfToken
    };

    const bookmarksCountBefore = await Request.get(`em-anno/${config.em[config.testEnv].docId}/bookmarks`, null, 200);

    const response = await Request.put('em-anno/bookmarks', await getNewBookmarkIdObject('test123', config.em[config.testEnv].docId, 0, null), headers, 200);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');
    expect(response.data).to.have.all.keys('id', 'name', 'documentId', 'createdBy', 'pageNumber', 'xCoordinate', 'yCoordinate', 'parent', 'previous');
    expect(response.data.documentId).to.equal(config.em[config.testEnv].docId);
  });

  it('Delete document bookmark', async () => {
    await Request.withSession(userName, password);
    const xsrfToken = await getXSRFToken(userName, password);
    const headers = {
      'X-XSRF-TOKEN': xsrfToken
    };
    const bookmarksgetResponse = await Request.get(`em-anno/${config.em[config.testEnv].docId}/bookmarks`, null, 200);
    let bookMarkIdToDelete = '';
    if (bookmarksgetResponse.data.length <= 1) {
      const createBookmarkResponse = await Request.put('em-anno/bookmarks', await getNewBookmarkIdObject('test123', config.em[config.testEnv].docId, 0, null), headers, 200);
      bookMarkIdToDelete = createBookmarkResponse.data.id;
    } else {
      bookMarkIdToDelete = bookmarksgetResponse.data[0].id;
    }

    const bookMarkDeleteResponse = await Request.delete('em-anno/bookmarks_multiple', { deleted: [bookMarkIdToDelete] }, headers, 200);
    expect(bookMarkDeleteResponse.status).to.equal(200);
  });

  async function getNewBookmarkIdObject(bookmarkName, docId, pagenum, previd) {
    const userId = await getUserId(userName, password);
    return {
      id: uuid(),
      name: bookmarkName,
      documentId: docId,
      createdBy: userId,
      pageNumber: pagenum,
      xCoordinate: -387,
      yCoordinate: -0.6666666666665151,
      parent: null,
      previous: previd
    };
  }

  async function getAnnotationObject() {
    const annoId = uuid();
    const rectangleId = uuid();

    const response = await Request.get(`em-anno/annotation-sets/filter?documentId=${config.em[config.testEnv].docId}`, null, 200);

    let annoSetid = '';
    if (response.status === 200) {
      annoSetid = response.data.id;
    } else {
      annoSetid = uuid();
    }

    return {
      id: annoId,
      color: 'FFFF00',
      comments: [],
      page: 1,
      rectangles: [
        {
          id: rectangleId,
          x: 418.564208984375,
          y: 761.390625,
          width: 212.24658203125,
          height: 18
        }
      ],
      type: 'highlight',
      documentId: config.em[config.testEnv].docId,
      annotationSetId: annoSetid
    };
  }
});
