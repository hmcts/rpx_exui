import { ComponentFixture, TestBed } from '@angular/core/testing';
import { caseFlagsRefData, initialState } from '../../../../hearing.test.data';
import { HearingsService } from '../../../../services/hearings.service';
import { HearingsUtils } from '../../../../utils/hearings.utils';
import { HearingRequirementsSectionComponent } from './hearing-requirements-section.component';

describe('HearingRequirementsSectionComponent', () => {
  let component: HearingRequirementsSectionComponent;
  let fixture: ComponentFixture<HearingRequirementsSectionComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const hearingsService = new HearingsService(mockedHttpClient);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        HearingRequirementsSectionComponent
      ],
      providers: [
        { provide: HearingsService, useValue: hearingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingRequirementsSectionComponent);
    component = fixture.componentInstance;
    component.caseFlagsRefData = caseFlagsRefData;
    component.hearingRequestMainModel = initialState.hearings.hearingRequest.hearingRequestMainModel;
    component.hearingRequestToCompareMainModel = initialState.hearings.hearingRequestToCompare.hearingRequestMainModel;
    component.serviceHearingValuesModel = initialState.hearings.hearingValues.serviceHearingValuesModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the HMC parties based on reasonableAdjustmentChangesConfirmed flag', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: false,
        reasonableAdjustmentChangesConfirmed: false,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.partyIds).toEqual(['P1']);
    expect(component.partyNamesInHMC).toEqual(['Jane Rogers']);
  });

  it('should display label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentChangesRequired).toEqual(true);
  });

  it('should not display label', () => {
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: false,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(component.reasonableAdjustmentChangesRequired).toEqual(false);
  });

  it('should call getPartyNameFormatted to format the party name', () => {
    spyOn(HearingsUtils, 'getPartyNameFormatted').and.returnValue('Jane Smith');
    hearingsService.propertiesUpdatedOnPageVisit = {
      hearingId: 'h000001',
      caseFlags: initialState.hearings.hearingValues.serviceHearingValuesModel.caseFlags,
      parties: initialState.hearings.hearingValues.serviceHearingValuesModel.parties,
      hearingWindow: initialState.hearings.hearingValues.serviceHearingValuesModel.hearingWindow,
      afterPageVisit: {
        reasonableAdjustmentChangesRequired: true,
        nonReasonableAdjustmentChangesRequired: true,
        partyDetailsChangesRequired: true,
        hearingWindowChangesRequired: true,
        hearingFacilitiesChangesRequired: false,
        hearingUnavailabilityDatesChanged: false
      }
    };
    component.ngOnInit();
    expect(HearingsUtils.getPartyNameFormatted).toHaveBeenCalled();
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('caseFlags');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'caseFlags', changeLink: '/hearings/request/hearing-requirements#linkAmendFlags'
    });
  });
});
