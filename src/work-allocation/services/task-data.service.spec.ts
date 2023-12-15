import { of } from 'rxjs';
import { TaskTypesService } from './task-types.service';

describe('TaskTypesService', () => {
  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
  mockHttpService.get.and.returnValue(of(null));
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);

  it('should be created', () => {
    const service: TaskTypesService = new TaskTypesService(mockHttpService, mockSessionStorageService);
    expect(service).toBeTruthy();
  });

  it('getTypesOfWork should make correct api call', () => {
    const service = new TaskTypesService(mockHttpService, mockSessionStorageService);
    service.getTypesOfWork();
    expect(mockHttpService.get).toHaveBeenCalledWith('/workallocation/task/types-of-work');
  });
});
