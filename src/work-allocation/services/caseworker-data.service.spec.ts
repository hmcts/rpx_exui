import { CaseworkerDataService } from './caseworker-data.service';

describe('WorkAllocation service', () => {
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
  describe('CaseworkerDataService', () => {
    it('should be Truthy', () => {
      const service = new CaseworkerDataService(mockHttpService, mockSessionStorageService);
      expect(service).toBeTruthy();
    });

    it('getForLocation should make correct api call', () => {
      const service = new CaseworkerDataService(mockHttpService, mockSessionStorageService);
      service.getForLocation('location123');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${CaseworkerDataService.caseWorkerUrl}/location/location123`);
    });

    it('getForService should make correct api call', () => {
      const service = new CaseworkerDataService(mockHttpService, mockSessionStorageService);
      service.getForService('service1');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${CaseworkerDataService.caseWorkerUrl}/service/service1`);
    });

    it('getForLocationAndService should make correct api call', () => {
      const service = new CaseworkerDataService(mockHttpService, mockSessionStorageService);
      service.getForLocationAndService('location123', 'service1');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${CaseworkerDataService.caseWorkerUrl}/location/location123/service/service1`);
    });

    it('search should make correct api call', () => {
      const service = new CaseworkerDataService(mockHttpService, mockSessionStorageService);
      service.search('searchTerm');
      expect(mockHttpService.post).toHaveBeenCalledWith(`${CaseworkerDataService.caseWorkerUrl}/search`, { term: 'searchTerm' });
    });

    it('getDetails should make correct api call', () => {
      const service = new CaseworkerDataService(mockHttpService, mockSessionStorageService);
      service.getDetails('123456');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${CaseworkerDataService.caseWorkerUrl}/123456`);
    });
  });
});
