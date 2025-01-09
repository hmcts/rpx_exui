import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { LocationDataService } from './location-data.service';

describe('WorkAllocation', () => {
  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
  const sessionStorageService = jasmine.createSpyObj('sessionStorageService', ['getItem']);

  describe('LocationDataService', () => {
    it('should be Truthy', () => {
      const service = new LocationDataService(mockHttpService, sessionStorageService);
      expect(service).toBeTruthy();
    });

    it('getLocations should make correct api call', () => {
      const service = new LocationDataService(mockHttpService, sessionStorageService);
      const options = {
        params: new HttpParams()
          .set('serviceCodes', 'CIVIL')
      };
      sessionStorageService.getItem.and.returnValue(null);
      mockHttpService.get.and.returnValue(of([]));
      service.getLocations(['CIVIL']);
      expect(mockHttpService.get).toHaveBeenCalledWith(LocationDataService.locationUrl, options);
    });

    it('getLocationsByRegion should make correct api call', () => {
      const service = new LocationDataService(mockHttpService, sessionStorageService);
      sessionStorageService.getItem.and.returnValue(null);
      mockHttpService.post.and.returnValue(of([]));
      service.getLocationsByRegion(['IA']);
      expect(mockHttpService.post).toHaveBeenCalledWith(LocationDataService.regionLocationUrl, { serviceIds: ['IA'] });
    });

    it('getSpecificLocations should make correct api call', () => {
      const service = new LocationDataService(mockHttpService, sessionStorageService);
      const options = {
        params: new HttpParams()
          .set('serviceCodes', 'CIVIL')
      };
      sessionStorageService.getItem.and.returnValue(null);
      mockHttpService.get.and.returnValue(of([]));
      service.getSpecificLocations(['213'], ['CIVIL']);
      expect(mockHttpService.get).toHaveBeenCalledWith(LocationDataService.fullLocationUrl, options);
      service.getSpecificLocations([], ['CIVIL']);
      expect(mockHttpService.get).not.toHaveBeenCalledWith(LocationDataService.fullLocationUrl);
    });
  });
});
