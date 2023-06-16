import * as bodyParser from 'body-parser';
import { Express } from 'express';
import { checkCachedJurisdictions, getJurisdictions } from './amendedJurisdictions';
import { getConfigValue } from './configuration';
import { proxiedReferences } from './configuration/references';
import { applyProxy } from './lib/middleware/proxy';
import { handleElasticSearchResponse, modifyRequest } from './searchCases';

export const initProxy = (app: Express) => {
  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/socket.io',
    source: '/socket.io',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_ACTIVITY_API_PATH),
    ws: true
  });

  applyProxy(app, {
    rewrite: false,
    source: '/documents',
    target: getConfigValue(proxiedReferences.SERVICES_DOCUMENTS_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/hearing-recordings',
    target: getConfigValue(proxiedReferences.SERVICES_EM_HRS_API_PATH)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/cases/documents',
    source: '/documentsv2',
    target: getConfigValue(proxiedReferences.SERVICES_DOCUMENTS_API_PATH_V2)
  });

  applyProxy(app, {
    filter: [
      '!/data/internal/searchCases'
    ],
    rewrite: false,
    source: [
      '/print',
      '/data'
    ],
    target: getConfigValue(proxiedReferences.SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    middlewares: [bodyParser.json()],
    onReq: modifyRequest,
    onRes: handleElasticSearchResponse,
    rewrite: false,
    source: '/data/internal/searchCases',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/addresses',
    source: '/api/addresses',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    onReq: checkCachedJurisdictions,
    onRes: getJurisdictions,
    rewrite: false,
    source: '/aggregated',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/icp',
    target: getConfigValue(proxiedReferences.SERVICES_ICP_API_URL),
    ws: true
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/api',
    source: '/em-anno',
    target: getConfigValue(proxiedReferences.SERVICES_EM_ANNO_API_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/api',
    source: '/doc-assembly',
    target: getConfigValue(proxiedReferences.SERVICES_EM_DOCASSEMBLY_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: [
      '/api/markups',
      '/api/redaction'
    ],
    target: getConfigValue(proxiedReferences.SERVICES_MARKUP_API_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '',
    source: '/payments',
    target: getConfigValue(proxiedReferences.SERVICES_PAYMENTS_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/refund',
    source: '/api/refund',
    target: getConfigValue(proxiedReferences.SERVICES_REFUNDS_API_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/notifications',
    source: '/api/notification',
    target: getConfigValue(proxiedReferences.SERVICES_NOTIFICATIONS_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/refdata/location',
    target: getConfigValue(proxiedReferences.SERVICES_LOCATION_REF_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/refdata/location',
    target: getConfigValue(proxiedReferences.SERVICES_LOCATION_REF_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/refdata/commondata/lov/categories/CaseLinkingReasonCode',
    target: getConfigValue(proxiedReferences.SERVICES_PRD_COMMONDATA_API)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/categoriesAndDocuments',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/documentData/caseref',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/getLinkedCases',
    target: getConfigValue(proxiedReferences.SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    // Note: the "service-id=" part of the URL is *not* missing a preceding '?', as would be expected if service-id was
    // a query string parameter. The Reference Data team confirms service-id is a *path* parameter and "service-id=" is
    // intentional (see Line 66 of CaseFlagApiController.java in
    // https://github.com/hmcts/rd-commondata-api/blob/master/src/main/java/uk/gov/hmcts/reform/cdapi/controllers)
    source: '/refdata/commondata/caseflags/service-id=:sid',
    target: getConfigValue(proxiedReferences.SERVICES_PRD_COMMONDATA_API)
  });
};
