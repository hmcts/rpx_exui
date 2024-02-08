import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../../common/httpMockAdapter';
import { ALL_COURT_LOCATIONS } from './data/location.mock.data';
import { toEpimmsLocation } from './models/location.model';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();
  const getLocationsUrl = /refdata\/location\/court-venues\/venue-search\?search-string=[\w]*/;
  const getLocationByIdUrl = /refdata\/location\/court-locations\?epimms_id=[\w]*/;

  mock.onGet(getLocationByIdUrl).reply((config) => {
    const requestURL = config.url;
    const epimmsIDIdx = config.url.lastIndexOf('=');
    const epimmsID = requestURL.substring(epimmsIDIdx + 1);
    const searchResult = ALL_COURT_LOCATIONS.find((location) => location.epimms_id === epimmsID);
    return [
      200,
      searchResult
    ];
  });

  mock.onGet(getLocationsUrl).reply((config) => {
    const requestURL = config.url;
    const searchTermStartIdx = config.url.indexOf('=');
    const searchTermEndIdx = config.url.indexOf('&');
    let searchTerm;

    if (searchTermEndIdx) {
      searchTerm = requestURL.substring(searchTermStartIdx + 1, searchTermEndIdx);
    } else {
      searchTerm = requestURL.substring(searchTermStartIdx + 1);
    }
    const courTypeIdStartIdx = config.url.lastIndexOf('=');
    const courTypeIdsStr = requestURL.substring(courTypeIdStartIdx + 1);
    const searchResult = ALL_COURT_LOCATIONS
      .filter((locationWithCourtType) => courTypeIdsStr.indexOf(locationWithCourtType.court_type_id) !== -1)
      .filter((location) =>
        (location.court_name ? location.court_name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        || (location.site_name ? location.site_name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        || (location.venue_name ? location.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        || (location.postcode ? location.postcode.replace(/\s+/g, '').toLowerCase().includes(searchTerm.toLowerCase()) : false)
        || (location.postcode ? location.postcode.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        || (location.court_address ? location.court_address.toLowerCase().includes(searchTerm.toLowerCase()) : false))
      .map((locationModel) => toEpimmsLocation(locationModel))
      .filter((locationByEPIMSModel, index, locationByEPIMSModelArray) =>
        locationByEPIMSModelArray.findIndex((t) => (t.epimms_id === locationByEPIMSModel.epimms_id)) === index);
    return [
      200,
      searchResult
    ];
  });
};
