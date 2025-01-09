import { AxiosResponse } from 'axios';
import { getConfigValue } from '../configuration';
import { SERVICES_LOCATION_API_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { EnhancedRequest } from '../lib/models';
import { setHeaders } from '../lib/proxy';
import { getServiceRefDataMappingList } from '../ref-data/ref-data-utils';
import { prepareGetLocationsUrl } from './util';

export async function handleLocationGet(fullPath: string, req: EnhancedRequest): Promise<AxiosResponse<any>> {
  const headers = setHeaders(req);
  return await http.get<any>(fullPath, { headers });
}

export async function commonGetFullLocation(req, allLocations: boolean) {
  let serviceCodes = [];
  let courtVenues = [];

  const serviceCodeQueryString = req.query.serviceCodes as string;
  const services = serviceCodeQueryString.split(',');
  const basePath = getConfigValue(SERVICES_LOCATION_API_PATH);
  const serviceRefDataMapping = getServiceRefDataMappingList();

  serviceRefDataMapping.forEach((serviceRef) => {
    if (services.includes(serviceRef.service)) {
      serviceCodes = [...serviceCodes, ...serviceRef.serviceCodes];
    }
  });
  for (const serviceCode of serviceCodes) {
    const path: string = prepareGetLocationsUrl(basePath, serviceCode);
    const response = await handleLocationGet(path, req);
    const filteredCourtVenues = allLocations ? response.data.court_venues.filter((venue) => venue.is_case_management_location === 'Y').
      map((venue) => ({ id: venue.epimms_id, locationName: venue.site_name })) : response.data.court_venues;
    courtVenues = [...courtVenues, ...filteredCourtVenues];
  }
  courtVenues = !allLocations ? courtVenues.filter((value, index, self) =>
    index === self.findIndex((location) => (
      location.epimms_id === value.epimms_id && location.site_name === value.site_name
    ))
  ) : courtVenues;
  return courtVenues;
}

export async function getFullLocationsForServices(req: EnhancedRequest) {
  const basePath = getConfigValue(SERVICES_LOCATION_API_PATH);
  const serviceRefDataMapping = getServiceRefDataMappingList();
  const services = req.body.bookableServices;
  let serviceCodes = [];
  // Note: will need to update mapping when more services are onboarded
  serviceRefDataMapping.forEach((serviceRef) => {
    if (services.includes(serviceRef.service)) {
      serviceCodes = [...serviceCodes, ...serviceRef.serviceCodes];
    }
  });
  let courtVenues = [];
  for (const serviceCode of serviceCodes) {
    const path: string = prepareGetLocationsUrl(basePath, serviceCode);
    const response = await handleLocationGet(path, req);
    courtVenues = [...courtVenues, ...response.data.court_venues];
  }
  return courtVenues;
}

// Similar to above function but used to get only small portion of full data
// Used to get region -> location information for location filter functionality
export async function getRegionLocationsForServices(req: EnhancedRequest) {
  const basePath = getConfigValue(SERVICES_LOCATION_API_PATH);
  const serviceRefDataMapping = getServiceRefDataMappingList();
  const services = req.body.serviceIds;
  let serviceCodes = [];
  // Note: will need to update mapping when more services are onboarded
  serviceRefDataMapping.forEach((serviceRef) => {
    if (services.includes(serviceRef.service)) {
      serviceCodes = [...serviceCodes, ...serviceRef.serviceCodes];
    }
  });
  const regionLocations = [];
  const regions = [];
  for (const serviceCode of serviceCodes) {
    const path: string = prepareGetLocationsUrl(basePath, serviceCode);
    const response = await handleLocationGet(path, req);
    response.data.court_venues.forEach((courtVenue) => {
      if (!regions.includes(courtVenue.region_id)) {
        regions.push(courtVenue.region_id);
        regionLocations.push({ regionId: courtVenue.region_id, locations: [courtVenue.epimms_id] });
      } else {
        regionLocations.find((locationList) =>
          locationList.regionId === courtVenue.region_id).locations.push(courtVenue.epimms_id);
      }
    });
  }
  return regionLocations;
}
