import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialState } from '../../../../../hearings/hearing.test.data';
import { HearingLocationModel } from '../../../../models/hearingLocation.model';
import { HMCLocationType } from '../../../../models/hearings.enum';
import { LocationByEPIMMSModel } from '../../../../models/location.model';
import { LocationsDataService } from '../../../../services/locations-data.service';
import { HearingVenueSectionComponent } from './hearing-venue-section.component';

describe('HearingVenueSectionComponent', () => {
  let component: HearingVenueSectionComponent;
  let fixture: ComponentFixture<HearingVenueSectionComponent>;
  const locationsDataServiceMock = jasmine.createSpyObj('locationsDataService', ['getLocationById']);
  const hearingLocations: HearingLocationModel[] = [
    {
      locationId: '196538',
      locationType: HMCLocationType.COURT
    },
    {
      locationId: '234850',
      locationType: HMCLocationType.COURT
    }
  ];

  const locationsReturnedByService: LocationByEPIMMSModel[] = [
    {
      epimms_id: '196538',
      site_name: 'Liverpool Social Security and Child Support Tribunal',
      court_name: 'LIVERPOOL SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL',
      open_for_public: 'YES',
      region_id: '5',
      region: 'North West',
      cluster_id: '3',
      cluster_name: 'Cheshire and Merseyside',
      court_status: 'Open',
      court_open_date: null,
      closed_date: null,
      postcode: 'L2 5UZ',
      court_address: 'PRUDENTIAL BUILDING, 36 DALE STREET, LIVERPOOL',
      phone_number: '',
      court_location_code: '',
      dx_address: '',
      welsh_site_name: '',
      welsh_court_address: '',
      venue_name: 'Liverpool',
      is_case_management_location: 'Y',
      is_hearing_location: 'Y'
    },
    {
      epimms_id: '234850',
      site_name: 'Cardiff Civil and Family Justice Centre',
      court_name: 'CARDIFF CIVIL AND FAMILY JUSTICE CENTRE',
      open_for_public: 'YES',
      region_id: '7',
      region: 'Wales',
      cluster_id: null,
      cluster_name: null,
      court_status: 'Open',
      court_open_date: null,
      closed_date: null,
      postcode: 'CF10 1ET',
      court_address: 'PARK STREET, CARDIFF',
      phone_number: '',
      court_location_code: '',
      dx_address: '99500 CARDIFF 6',
      welsh_site_name: '',
      welsh_court_address: '',
      venue_name: '',
      is_case_management_location: '',
      is_hearing_location: ''
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        HearingVenueSectionComponent
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: LocationsDataService,
          useValue: locationsDataServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingVenueSectionComponent);
    component = fixture.componentInstance;
    component.hearingRequestMainModel = initialState.hearings.hearingRequest.hearingRequestMainModel;
    component.hearingRequestToCompareMainModel = initialState.hearings.hearingRequestToCompare.hearingRequestMainModel;
    component.hearingRequestMainModel.hearingDetails.hearingLocations = hearingLocations;
    locationsDataServiceMock.getLocationById.and.returnValue(of(locationsReturnedByService));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set locations', () => {
    component.ngOnInit();
    component.locations$.subscribe((result: LocationByEPIMMSModel[]) => {
      expect(result).toEqual(locationsReturnedByService);
    });
    expect(component.showAmmendedForHeading).toEqual(false);
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('venue');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'venue', changeLink: '/hearings/request/hearing-venue#inputLocationSearch'
    });
  });
});
