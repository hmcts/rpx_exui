import { Response } from 'express';
import { getConfigValue, showFeature } from '../configuration';
import { FEATURE_JRD_E_LINKS_V2_ENABLED, SERVICES_CASE_JUDICIAL_REF_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { getServiceRefDataMappingList } from '../ref-data/ref-data-utils';
import { PERSON } from './constants/mock.data';
import { PersonRole } from './interfaces/person';
import { applySearchFilter } from './util';

const HEADER_ACCEPT_V1 = 'application/json';
const HEADER_ACCEPT_V2 = 'application/vnd.jrd.api+json;Version=2.0';
const JUDICIAL_REF_URL = getConfigValue(SERVICES_CASE_JUDICIAL_REF_PATH);

// judicial person search
export async function postFindPersonSearch(req: EnhancedRequest, res: Response) {
  if (!req.body || !req.body.searchOptions || !req.body.searchOptions.searchTerm) {
    res.status(400);
    res.send('searchOptions body missing. searchTerm is missing');
    return;
  }
  const searchString = req.body.searchOptions.searchTerm;
  const domain = req.body.searchOptions.userRole as PersonRole;
  const services = req.body.searchOptions.services as string[];
  const serviceCodes: string[] = [];
  const serviceRefDataMapping = getServiceRefDataMappingList();
  // add the service references in order to search by service
  serviceRefDataMapping.forEach((serviceRef) => {
    if (services.includes(serviceRef.service)) {
      serviceRef.serviceCodes.forEach((serviceRefserviceCodes) => {
        serviceCodes.push(serviceRefserviceCodes);
      });
    }
  });
  let searchResult: any = [];
  if (domain === PersonRole.JUDICIAL) {
    try {
      for (const serviceCode of serviceCodes) {
        // Judicial User search API version to be used depends upon the config entry FEATURE_JRD_E_LINKS_V2_ENABLED's value
        req.headers.accept = showFeature(FEATURE_JRD_E_LINKS_V2_ENABLED)
          ? HEADER_ACCEPT_V2
          : HEADER_ACCEPT_V1;
        const headers = setHeaders(req);
        const body = { searchString, serviceCode };
        const response = await http.post(`${JUDICIAL_REF_URL}/refdata/judicial/users/search`, body, { headers });
        searchResult = response.data ? [...response.data, ...searchResult] : searchResult;
      }
      searchResult = searchResult.map((s: any) => ({ ...s, name: s.fullName, email: s.emailId, id: s.idamId }));
    } catch (e) {
      if (e.status === 404) {
        res.status(200);
        res.send([]);
        return;
      }
      res.status(e.status);
      res.send(e.data.errorMessage);
      return;
    }
  } else {
    searchResult = PERSON.filter((person) => applySearchFilter(person, domain, searchString));
  }

  res.status(200);
  res.send(searchResult);
}
