import * as bodyParser from 'body-parser';
import { Express } from 'express';
import * as amendedJurisdictions from './amendedJurisdictions';
import { getConfigValue } from './configuration';
import {
  SERVICES_CCD_COMPONENT_API_PATH,
  SERVICES_CCD_DATA_STORE_API_PATH,
  SERVICES_DOCUMENTS_API_PATH,
  SERVICES_DOCUMENTS_API_PATH_V2,
  SERVICES_EM_ANNO_API_URL,
  SERVICES_EM_DOCASSEMBLY_API_URL,
  SERVICES_EM_HRS_API_PATH,
  SERVICES_ICP_API_URL,
  SERVICES_LOCATION_REF_API_URL,
  SERVICES_MARKUP_API_URL,
  SERVICES_PAYMENTS_URL,
  SERVICES_PRD_COMMONDATA_API,
  SERVICES_REFUNDS_API_URL,
  SERVICES_NOTIFICATIONS_API_URL,
  SERVICES_TRANSLATION_API_URL
} from './configuration/references';
import { applyProxy } from './lib/middleware/proxy';
import * as searchCases from './searchCases';
import * as documents from './documents';

export const initProxy = (app: Express) => {
  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/activity',
    source: [
      '/activity'
    ],
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    middlewares: [bodyParser.json()],
    onReq: documents.handleRequest,
    onRes: documents.handleResponse,
    rewrite: false,
    source: '/documents',
    target: getConfigValue(SERVICES_DOCUMENTS_API_PATH)
  }, false);

  applyProxy(app, {
    rewrite: false,
    source: '/hearing-recordings',
    target: getConfigValue(SERVICES_EM_HRS_API_PATH)
  });

  applyProxy(app, {
    middlewares: [bodyParser.json()],
    onReq: documents.handleRequest,
    onRes: documents.handleResponse,
    rewrite: true,
    rewriteUrl: '/cases/documents',
    source: '/documentsv2',
    target: getConfigValue(SERVICES_DOCUMENTS_API_PATH_V2)
  }, false);

  applyProxy(app, {
    middlewares: [bodyParser.json()],
    onReq: searchCases.modifyRequest,
    onRes: searchCases.handleElasticSearchResponse,
    rewrite: false,
    source: '/data/internal/searchCases',
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
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
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/addresses',
    source: '/api/addresses',
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    onReq: amendedJurisdictions.checkCachedJurisdictions,
    onRes: amendedJurisdictions.getJurisdictions,
    rewrite: false,
    source: '/aggregated',
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/icp',
    target: getConfigValue(SERVICES_ICP_API_URL),
    ws: true
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/api',
    source: '/em-anno',
    target: getConfigValue(SERVICES_EM_ANNO_API_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/api',
    source: '/doc-assembly',
    target: getConfigValue(SERVICES_EM_DOCASSEMBLY_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: [
      '/api/markups',
      '/api/redaction'
    ],
    target: getConfigValue(SERVICES_MARKUP_API_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '',
    source: '/payments',
    target: getConfigValue(SERVICES_PAYMENTS_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/refund',
    source: '/api/refund',
    target: getConfigValue(SERVICES_REFUNDS_API_URL)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/notifications',
    source: '/api/notification',
    target: getConfigValue(SERVICES_NOTIFICATIONS_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/refdata/location',
    target: getConfigValue(SERVICES_LOCATION_REF_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/refdata/location',
    target: getConfigValue(SERVICES_LOCATION_REF_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/refdata/commondata/lov/categories/CaseLinkingReasonCode',
    target: getConfigValue(SERVICES_PRD_COMMONDATA_API)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/categoriesAndDocuments',
    target: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/documentData/caseref',
    target: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/getLinkedCases',
    target: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: true,
    source: '/api/translation',
    rewriteUrl: '/translation',
    target: getConfigValue(SERVICES_TRANSLATION_API_URL)
  });

  applyProxy(app, {
    rewrite: false,
    // Note: the "service-id=" part of the URL is *not* missing a preceding '?', as would be expected if service-id was
    // a query string parameter. The Reference Data team confirms service-id is a *path* parameter and "service-id=" is
    // intentional (see Line 66 of CaseFlagApiController.java in
    // https://github.com/hmcts/rd-commondata-api/blob/master/src/main/java/uk/gov/hmcts/reform/cdapi/controllers)
    source: '/refdata/commondata/caseflags/service-id=:sid',
    target: getConfigValue(SERVICES_PRD_COMMONDATA_API)
  });
};
