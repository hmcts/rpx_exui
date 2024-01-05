import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { RefDataService } from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { LocationByEpimmsModelWithServiceCodes } from '../../../../models/location-by-service-code-model';
import { StaffSelectLocationComponent } from './staff-select-location.component';

describe('StaffSelectLocationComponent', () => {
  let component: StaffSelectLocationComponent;
  let fixture: ComponentFixture<StaffSelectLocationComponent>;
  let refDataServiceMock: jasmine.SpyObj<RefDataService>;

  beforeEach(async () => {
    refDataServiceMock = jasmine.createSpyObj<RefDataService>('RefDataService', ['getLocationsByServiceCodes']);
    refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MatAutocompleteModule,
        ReactiveFormsModule],
      declarations: [StaffSelectLocationComponent],
      providers: [
        { provide: RefDataService, useValue: refDataServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffSelectLocationComponent);
    component = fixture.componentInstance;
    component.locationsControl = new FormControl([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('lookup by serviceCodes (i.e. servicesField does not exist)', () => {
    let dummyLocations: LocationByEpimmsModelWithServiceCodes[];
    beforeEach(() => {
      dummyLocations = [
        {
          site_name: 'Aberdeen Tribunal Hearing Centre',
          court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
          epimms_id: '219164',
          open_for_public: 'Yes',
          region_id: '9',
          region: 'Scotland',
          cluster_id: '1',
          cluster_name: 'Scotland',
          court_status: 'Open',
          court_open_date: '01/01/2010',
          postcode: 'AB11 6LT',
          court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test1',
          phone_number: '01224 555555',
          court_location_code: 'AB1',
          dx_address: 'DX 123456 Aberdeen 1',
          venue_name: 'Aberdeen',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          serviceCodes: ['BFA1']
        },
        {
          site_name: 'Aberdeen Tribunal Hearing Centre',
          court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
          epimms_id: '219164',
          open_for_public: 'Yes',
          region_id: '9',
          region: 'Scotland',
          cluster_id: '1',
          cluster_name: 'Scotland',
          court_status: 'Open',
          court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test2',
          postcode: 'AB11 6LT',
          court_location_code: 'AB1',
          dx_address: 'DX 123456 Aberdeen 1',
          venue_name: 'Aberdeen',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          serviceCodes: ['AAA7']
        },
        {
          epimms_id: '827534',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aberystwyth Justice Centre',
          court_name: 'ABERYSTWYTH JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '8',
          region: 'Wales',
          venue_name: 'Aberystwyth',
          open_for_public: 'Yes',
          court_address: 'TREFECHAN test3',
          postcode: 'SY23 1AS ',
          serviceCodes: ['BFA1']
        },
        {
          epimms_id: '827534',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aberystwyth Justice Centre',
          court_name: 'ABERYSTWYTH JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '8',
          region: 'Wales',
          venue_name: 'Aberystwyth',
          open_for_public: 'Yes',
          court_address: 'TREFECHAN test4',
          postcode: 'SY23 1AS ',
          serviceCodes: ['BFA1']
        },
        {
          epimms_id: '827534',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aberystwyth Justice Centre',
          court_name: 'ABERYSTWYTH JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '8',
          region: 'Wales',
          venue_name: 'Aberystwyth',
          open_for_public: 'Yes',
          court_address: 'TREFECHAN test5',
          postcode: 'SY23 1AS ',
          serviceCodes: ['BFA1']
        },
        {
          epimms_id: '827534',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aberystwyth Justice Centre',
          court_name: 'ABERYSTWYTH JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '8',
          region: 'Wales',
          venue_name: 'Aberystwyth',
          open_for_public: 'Yes',
          court_address: 'TREFECHAN test6',
          postcode: 'SY23 1AS ',
          serviceCodes: ['BFA1']
        },
        {
          epimms_id: '450049',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aldershot Justice Centre',
          court_name: 'ALDERSHOT JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '7',
          region: 'South West',
          venue_name: 'Aldershot',
          cluster_id: '9',
          cluster_name: 'Hampshire, Wiltshire, IOW',
          open_for_public: 'Yes',
          court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test7',
          postcode: 'GU11 1NY',
          serviceCodes: ['BFA1']
        },
        {
          epimms_id: '450049',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aldershot Justice Centre',
          court_name: 'ALDERSHOT JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '7',
          region: 'South West',
          venue_name: 'Aldershot',
          cluster_id: '9',
          cluster_name: 'Hampshire, Wiltshire, IOW',
          open_for_public: 'Yes',
          court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test8',
          postcode: 'GU11 1NY',
          serviceCodes: ['AAA7']
        },
        {
          epimms_id: '450049',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Aldershot Justice Centre',
          court_name: 'ALDERSHOT JUSTICE CENTRE',
          court_status: 'Open',
          region_id: '7',
          region: 'South West',
          venue_name: 'Aldershot',
          cluster_id: '9',
          cluster_name: 'Hampshire, Wiltshire, IOW',
          open_for_public: 'Yes',
          court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test9',
          postcode: 'GU11 1NY',
          serviceCodes: ['AAA7']
        },
        {
          epimms_id: '271588',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Amersham Law Courts',
          court_name: 'AMERSHAM LAW COURTS',
          court_status: 'Open',
          region_id: '6',
          region: 'South East',
          venue_name: 'Amersham',
          cluster_id: '17',
          cluster_name: 'Thames Valley',
          open_for_public: 'Yes',
          court_address: 'KING GEORGE V ROAD AMERSHAM BUCKINGHAMSHIRE test10',
          postcode: 'HP6 5AJ',
          serviceCodes: ['AAA7']
        },
        {
          epimms_id: '239985',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Ashford Tribunal Hearing Centre',
          court_name: 'ASHFORD TRIBUNAL HEARING CENTRE',
          court_status: 'Open',
          region_id: '6',
          region: 'South East',
          venue_name: 'Ashford',
          cluster_id: '11',
          cluster_name: 'Kent',
          open_for_public: 'Yes',
          court_address: 'COUNTY SQUARE test11',
          postcode: 'TN23 1YB',
          serviceCodes: ['AAA7']
        },
        {
          epimms_id: '239985',
          is_hearing_location: 'Y',
          is_case_management_location: 'Y',
          site_name: 'Ashford Tribunal Hearing Centre',
          court_name: 'ASHFORD TRIBUNAL HEARING CENTRE',
          court_status: 'Open',
          region_id: '6',
          region: 'South East',
          venue_name: 'Ashford',
          cluster_id: '11',
          cluster_name: 'Kent',
          open_for_public: 'Yes',
          court_address: 'MARCUS SQUARE',
          postcode: 'TN23 1YB',
          serviceCodes: ['AAA7']
        }
      ];
      component.serviceCodes$ = of(['AAA7', 'BFA1']);
      refDataServiceMock.getLocationsByServiceCodes.and.returnValue(
        of(dummyLocations)
      );
    });

    describe('filteredList$', () => {
      it('should return false and should not call the api when observable searchTerm valueChanges emits', fakeAsync(() => {
        component.filteredList$.subscribe((result) => {
          expect(result).toBe(false);
        });

        component.searchTermFormControl.setValue('');
        tick();
        flush();
      }));

      it('should get an array when search term is not an empty string', fakeAsync(() => {
        // obsCount added as observable should always run initially
        let obsCount = 0;
        component.filteredList$.subscribe((result) => {
          obsCount > 0 ? expect(Array.isArray(result)).toBe(true) : expect(Array.isArray(result)).toBe(false);
          obsCount++;
        });

        component.searchTermFormControl.setValue('123');
        tick();
        flush();
      }));

      it('should filter out locations based on searchTerm', fakeAsync(() => {
        refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([dummyLocations[0], dummyLocations[1]]));
        let obsCount = 0;
        component.filteredList$.subscribe((result) => {
          obsCount > 0 ? expect(result).toEqual([dummyLocations[0]]) : expect(Array.isArray(result)).toBe(false);
          obsCount++;
        });

        component.searchTermFormControl.setValue(dummyLocations[0].venue_name);
        tick();
        flush();
      }));

      it('should fill locations with correct service codes', fakeAsync(() => {
        refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([dummyLocations[0], dummyLocations[1]]));
        let obsCount = 0;
        component.filteredList$.subscribe((result) => {
          if (obsCount > 1) {
            expect(result).toEqual([dummyLocations[0]]);
            expect(result[0].serviceCodes).toEqual(['BFA1', 'AAA7']);
          }
          obsCount++;
        });
        component.searchTermFormControl.setValue(dummyLocations[0].venue_name);
        tick();
        flush();
      }));

      it('should correctly set service codes for locations in formControl', fakeAsync(() => {
        refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([dummyLocations[0], dummyLocations[1]]));
        const mockLocationInControl: any = dummyLocations[0];
        // also ensures we are checking numbers as well as strings
        mockLocationInControl.location_id = parseInt(mockLocationInControl.epimms_id);
        component.locationsControl.setValue([mockLocationInControl]);
        let obsCount = 0;
        component.filteredList$.subscribe((result) => {
          obsCount > 0 ? expect(result).toEqual([dummyLocations[0]]) : expect(result).toEqual(false);
          expect(component.locationsControl.value[0].serviceCodes[0]).toEqual('BFA1');
          obsCount++;
        });

        component.searchTermFormControl.setValue(dummyLocations[0].venue_name);
        tick();
        flush();
      }));
    });
  });
});
