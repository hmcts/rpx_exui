import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { BookingService } from './booking.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        BookingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([BookingService], (service: BookingService) => {
    expect(service).toBeTruthy();
  }));

  describe('getBookings()', () => {
    it('should make a post call', inject([HttpTestingController, BookingService], (httpMock: HttpTestingController, service: BookingService) => {
      service.getBookings('21334a2b-79ce-44eb-9168-2d49a744be9c', ['CIVIL']).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/am/getBookings');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });

  describe('getBookingLocation()', () => {
    it('should make a get call', inject([HttpTestingController, BookingService], (httpMock: HttpTestingController, service: BookingService) => {
      service.getBookingLocation('123').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/refdata/location/building-locations?epimms_id=123');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    }));
  });

  describe('createBooking()', () => {
    it('should make a post to create a booking', inject([HttpTestingController, BookingService], (httpMock: HttpTestingController, service: BookingService) => {
      service.createBooking({ userId: '21334a2b-79ce-44eb-9168-2d49a744be9c',
        locationId: '1', regionId: '1', beginDate: null, endDate: null }).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/am/createBooking');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });

  describe('refreshRoleAssignments()', () => {
    it('should make a post to refresh the role assignments', inject([HttpTestingController, BookingService], (httpMock: HttpTestingController, service: BookingService) => {
      service.refreshRoleAssignments('userId').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/am/role-mapping/judicial/refresh');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));
  });
});
