import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '@hmcts/ccd-case-ui-toolkit';
import { LocationByEPIMMSModel, SearchLocationComponent } from '@hmcts/rpx-xui-common-lib';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { LocationsDataService } from '../../../services/locations-data.service';
import { HearingVenueComponent } from './hearing-venue.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  selector: 'exui-hearing-parties-title',
  template: ''
})
class MockHearingPartiesComponent {
  @Input() public error: ErrorMessage;
}

class NativeElement {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public focus() {}
}

class MockAutoCompleteInputBox {
  public nativeElement: NativeElement = new NativeElement();
}

@Component({
  selector: 'exui-search-location',
  template: ''
})
class MockLocationSearchContainerComponent {
  @Input() public serviceIds: string = '';
  @Input() public locationType: string = '';
  @Input() public disabled: boolean = false;
  @Input() public selectedLocations: LocationByEPIMMSModel[];
  @Input() public submitted?: boolean = true;
  @Input() public control: AbstractControl;
  public autoCompleteInputBox: MockAutoCompleteInputBox = new MockAutoCompleteInputBox();
}

describe('HearingVenueComponent', () => {
  const FOUND_LOCATIONS: LocationByEPIMMSModel[] = [{
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
  }];
  let component: HearingVenueComponent;
  let fixture: ComponentFixture<HearingVenueComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  const locationsDataService: LocationsDataService = new LocationsDataService(mockedHttpClient);

  beforeEach(async () => {
    TestBed.configureTestingModule({
    declarations: [HearingVenueComponent, MockLocationSearchContainerComponent, MockHearingPartiesComponent, MockRpxTranslatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [ReactiveFormsModule, RouterTestingModule],
    providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        { provide: LocationsDataService, useValue: locationsDataService },
        {
            provide: ActivatedRoute,
            useValue: {
                fragment: of('point-to-me')
            }
        },
        FormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
    fixture = TestBed.createComponent(HearingVenueComponent);
    component = fixture.componentInstance;
    component.selectedLocations = [{
      epimms_id: '1',
      court_name: 'wolverhampton court',
      region: 'welsh'
    }] as LocationByEPIMMSModel[];

    spyOn(component, 'removeSelection').and.callThrough();
    spyOn(component, 'appendLocation').and.callThrough();
    spyOn(component, 'prepareHearingRequestData').and.callThrough();
    spyOn(component, 'isFormValid').and.callThrough();
    spyOn(locationsDataService, 'getLocationById').and.returnValue(of(FOUND_LOCATIONS));
    component.searchLocationComponent = new MockLocationSearchContainerComponent() as unknown as SearchLocationComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hearingList.hearingListMainModel to SSCS', async () => {
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      expect(component.selectedLocations).toEqual([
        ...FOUND_LOCATIONS
      ]);

      expect(component.serviceIds).toEqual('BBA3');
    });
  });

  it('should call prepareHearingRequestData when executeAction is called with a valid form', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(undefined);
    fixture.detectChanges();
    component.executeAction(ACTION.CONTINUE);
    expect(component.prepareHearingRequestData).toHaveBeenCalled();
  });

  it('should true when calling isFormValid with partyChannel', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(undefined);
    fixture.detectChanges();
    const formValid = component.isFormValid();
    expect(formValid).toEqual(true);
  });

  it('should return false when calling isFormValid with location selected', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue('Hatt');
    const formValid = component.isFormValid();
    expect(formValid).toEqual(false);
    expect(component.findLocationFormGroup.controls.locationSelectedFormControl.errors)
      .toEqual({ addLocation: 'Add a location' });
  });

  it('should return false when calling isFormValid with location selected is undefined', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.markAsDirty();
    const formValid = component.isFormValid();
    expect(formValid).toEqual(false);
    expect(component.findLocationFormGroup.controls.locationSelectedFormControl.errors)
      .toEqual({ addLocation: 'Enter a location' });
  });

  it('should return false when calling isFormValid with location not selected', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.markAsPristine();
    component.selectedLocations = [];
    const formValid = component.isFormValid();
    expect(formValid).toEqual(false);
    expect(component.validationErrors.length).toEqual(1);
  });

  it('should return false for isFormValid when a location is selected and not added', () => {
    const location: LocationByEPIMMSModel = {
      epimms_id: '123',
      court_name: 'Test Caurt Name',
      region: 'Wales'
    } as LocationByEPIMMSModel;

    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(location);
    fixture.detectChanges();
    const formValid = component.isFormValid();
    expect(formValid).toEqual(false);
  });

  it('should return false for isLocationValid when locationSelectedformcontrol is not valid and is dirty', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(undefined);
    component.findLocationFormGroup.controls.locationSelectedFormControl.markAsDirty();
    fixture.detectChanges();
    const formValid = component.isLocationValid();
    expect(component.findLocationFormGroup.controls.locationSelectedFormControl.errors.required).toBeTruthy();
    expect(formValid).toEqual(false);
  });

  it('should return true for isLocationValid when locationSelectedformcontrol is not valid and is dirty', () => {
    const location: LocationByEPIMMSModel = {
      epimms_id: '123',
      court_name: 'Test Caurt Name',
      region: 'Wales'
    } as LocationByEPIMMSModel;

    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(location);
    component.findLocationFormGroup.controls.locationSelectedFormControl.markAsDirty();
    fixture.detectChanges();
    const result = component.isLocationValid();
    expect(component.validationErrors).toEqual([]);
    expect(result).toEqual(true);
  });

  it('should display selection in selection list', async () => {
    const location = {
      court_venue_id: '100',
      epimms_id: '219164',
      is_hearing_location: 'Y',
      is_case_management_location: 'Y',
      site_name: 'Aberdeen Tribunal Hearing Centre',
      court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
      court_status: 'Open',
      region_id: '9',
      region: 'Scotland',
      court_type_id: '17',
      court_type: 'Employment Tribunal',
      open_for_public: 'Yes',
      court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN',
      postcode: 'AB11 6LT'
    } as LocationByEPIMMSModel;

    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(location);
    component.addSelection();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.selectedLocations.length).toBeGreaterThan(0);
      expect(component.findLocationFormGroup.controls.locationSelectedFormControl.value).toBeUndefined();
    });
  });

  it('should remove selection in selection list', async () => {
    const location = {
      court_venue_id: '100',
      epimms_id: '219164',
      is_hearing_location: 'Y',
      is_case_management_location: 'Y',
      site_name: 'Aberdeen Tribunal Hearing Centre',
      court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
      court_status: 'Open',
      region_id: '9',
      region: 'Scotland',
      court_type_id: '17',
      court_type: 'Employment Tribunal',
      open_for_public: 'Yes',
      court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN',
      postcode: 'AB11 6LT'
    } as LocationByEPIMMSModel;

    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(location);
    component.addSelection();
    fixture.detectChanges();
    expect(component.selectedLocations.length).toBe(3);
    component.removeSelection(location);
    expect(component.selectedLocations.length).toBe(2);
  });

  it('should show error when there is no locations found', async () => {
    const location = {
      court_venue_id: '100',
      epimms_id: '219164',
      is_hearing_location: 'Y',
      is_case_management_location: 'Y',
      site_name: 'Aberdeen Tribunal Hearing Centre',
      court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
      court_status: 'Open',
      region_id: '9',
      region: 'Scotland',
      court_type_id: '17',
      court_type: 'Employment Tribunal',
      open_for_public: 'Yes',
      court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN',
      postcode: 'AB11 6LT'
    } as LocationByEPIMMSModel;
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue(undefined);
    component.addSelection();

    await fixture.whenStable();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('.govuk-error-summary'));
    expect(errorElement).toBeDefined();

    component.selectedLocations = [location];
    component.removeSelection(location);
    fixture.detectChanges();
    expect(component.selectedLocations.length).toEqual(0);
  });

  it('should show summry header', async () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue('TEST ERROR');
    await fixture.whenStable();
    const errorElement = fixture.debugElement.query(By.css('.govuk-error-summary__list'));
    expect(errorElement).toEqual(null);
  });

  it('should reset form control and set it pristine when appendLocation is called', () => {
    component.findLocationFormGroup.controls.locationSelectedFormControl.setValue('TEST ERROR');
    component.appendLocation([]);
    expect(component.findLocationFormGroup.controls.locationSelectedFormControl.pristine).toBeTruthy();
    expect(component.findLocationFormGroup.controls.locationSelectedFormControl.value).toEqual(undefined);
  });

  it('should include page elements', () => {
    const hearingHeader = fixture.debugElement.query(By.css('.govuk-heading-l'));
    expect(hearingHeader.nativeElement.innerText).toContain('What are the hearing venue details?');
    const hint = fixture.debugElement.query(By.css('.govuk-hint'));
    expect(hint.nativeElement.innerText).toContain('If this is a fully remote hearing you must still select the court or tribunal which will be managing the case.');
    const findCourtLink = fixture.debugElement.query(By.css('.govuk-inset-text'));
    expect(findCourtLink.nativeElement.innerText).toContain('You can check the venue has the required facilities or reasonable adjustments using');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
