import { Component, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { hearingActualsMainModel, hearingStageRefData, initialState, partyChannelsRefData, partySubChannelsRefData } from '../../../hearing.test.data';
import { ActualHearingDayModel } from '../../../models/hearingActualsMainModel';
import { ACTION, HearingResult, PartyType } from '../../../models/hearings.enum';
import { ConvertToValuePipe } from '../../../pipes/convert-to-value.pipe';
import { HearingsService } from '../../../services/hearings.service';
import { ActualHearingsUtils } from '../../../utils/actual-hearings.utils';
import { HearingActualsAddEditSummaryComponent } from './hearing-actuals-add-edit-summary.component';
import { DatePipe, FormatTranslatorService } from '@hmcts/ccd-case-ui-toolkit';
import { SessionStorageService } from 'src/app/services';
import { PartyDetailsModel } from '../../../models/partyDetails.model';
import { IndividualDetailsModel } from '../../../models/individualDetails.model';

@Pipe({ name: 'transformAnswer' })
export class MockHearingAnswersPipe implements PipeTransform {
  public transform(): string {
    return '';
  }
}

@Component({
  template: `
    <div>Nothing</div>`
})
class NothingComponent {}

describe('HearingActualsAddEditSummaryComponent', () => {
  let component: HearingActualsAddEditSummaryComponent;
  let fixture: ComponentFixture<HearingActualsAddEditSummaryComponent>;
  let store: any;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  const hearingRole = [
    {
      category_key: 'EntityRoleCode',
      key: 'appellant',
      value_en: 'Appellant',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Applicant',
      parent_key: 'APPL',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'claimant',
      value_en: 'Appointee',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Support',
      parent_key: 'SUPP',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'interpreter',
      value_en: 'Joint Party',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Applicant',
      parent_key: 'APPL',
      active_flag: 'Y',
      child_nodes: null
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HearingActualsAddEditSummaryComponent, ConvertToValuePipe, MockHearingAnswersPipe, MockRpxTranslatePipe, DatePipe],
      imports: [RouterTestingModule.withRoutes(
        [
          { path: 'hearings/actuals/1000000/hearing-actual-edit-summary', component: NothingComponent }
        ]
      )],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({
              id: '1'
            })),
            snapshot: {
              params: {
                id: '1'
              },
              data: {
                partyChannels: partyChannelsRefData,
                partySubChannels: partySubChannelsRefData,
                hearingRole
              }
            }
          }
        },
        DatePipe,
        FormatTranslatorService,
        { provide: SessionStorageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingActualsAddEditSummaryComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe', () => {
    component.sub = new Observable().subscribe();
    spyOn(component.sub, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.sub.unsubscribe).toHaveBeenCalled();
  });

  it('should navigate to case details page when click back button', () => {
    const caseInfo = `{
      "caseType": "Asylum",
      "cid": "1231231231231231",
      "jurisdiction": "IA"
    }`;
    spyOn(component.sessionStorageService, 'getItem').and.returnValue(caseInfo);
    const navigateSpy = spyOn(component.router, 'navigate');

    component.onBack();
    expect(component.sessionStorageService.getItem).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'cases', 'case-details', '1231231231231231', 'hearings']);
  });

  it('should navigate to back page if caseId not available when click back button', () => {
    spyOn(component.sessionStorageService, 'getItem').and.returnValue(null);
    const historyBackSpy = spyOn(window.history, 'back');

    component.onBack();
    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should return correct hearing type from the hearing types', () => {
    component.hearingTypes = hearingStageRefData;
    const description = component.getHearingTypeDescription('initial');
    expect(description).toEqual('Initial');
  });

  it('should submit hearing details', () => {
    component.actualHearingDays = hearingActualsMainModel.hearingActuals.actualHearingDays;
    component.id = '1111222233334444';
    component.hearingResult = HearingResult.COMPLETED;
    component.onSubmitHearingDetails();
  });

  it('should fail submitting hearing details if hearing result is not selected', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.hearingResult = '';
    component.onSubmitHearingDetails();
    expect(storeDispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('should dispatach and update Hearing Actuals', () => {
    const hearingDay = {
      hearingDate: '2021-03-12',
      hearingStartTime: '2021-03-12T09:00:00.000Z',
      hearingEndTime: '2021-03-13T10:00:00.000Z',
      notRequired: false,
      pauseDateTimes: [],
      actualDayParties: [
        {
          actualPartyId: '1',
          individualDetails: {
            firstName: 'Bob',
            lastName: 'Jones'
          },
          actualOrganisationName: 'Company A',
          didNotAttendFlag: false,
          partyChannelSubType: 'inPerson',
          partyRole: 'appellant',
          representedParty: ''
        },
        {
          actualPartyId: '2',
          individualDetails: {
            firstName: 'Mary',
            lastName: 'Jones'
          },
          actualOrganisationName: 'Company B',
          didNotAttendFlag: false,
          partyChannelSubType: 'inPerson',
          partyRole: 'claimant',
          representedParty: ''
        },
        {
          actualPartyId: '3',
          individualDetails: {
            firstName: 'James',
            lastName: 'Gods'
          },
          actualOrganisationName: 'Solicitors A',
          didNotAttendFlag: false,
          partyChannelSubType: 'inPerson',
          partyRole: 'interpreter',
          representedParty: '1'
        }
      ]
    };
    const storeDispatchSpy = spyOn(store, 'dispatch');
    spyOn(ActualHearingsUtils, 'mergeSingleHearingPartActuals');

    component.changeWasThisHearingDayRequired(hearingDay);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(ActualHearingsUtils.mergeSingleHearingPartActuals).toHaveBeenCalledTimes(1);
  });

  it('should save one hearing day actuals for specific hearingDate', () => {
    const hearingDay = {
      hearingDate: '2021-03-12',
      hearingStartTime: '2021-03-12T09:00:00.000Z',
      hearingEndTime: '2021-03-13T10:00:00.000Z',
      notRequired: false,
      pauseDateTimes: [],
      actualDayParties: [
        {
          actualPartyId: '1',
          individualDetails: {
            firstName: 'Bob',
            lastName: 'Jones'
          },
          actualOrganisationName: 'Company A',
          didNotAttendFlag: false,
          partyChannelSubType: 'inPerson',
          partyRole: 'appellant',
          representedParty: ''
        },
        {
          actualPartyId: '2',
          individualDetails: {
            firstName: 'Mary',
            lastName: 'Jones'
          },
          actualOrganisationName: 'Company B',
          didNotAttendFlag: false,
          partyChannelSubType: 'inPerson',
          partyRole: 'claimant',
          representedParty: ''
        },
        {
          actualPartyId: '3',
          individualDetails: {
            firstName: 'James',
            lastName: 'Gods'
          },
          actualOrganisationName: 'Solicitors A',
          didNotAttendFlag: false,
          partyChannelSubType: 'inPerson',
          partyRole: 'interpreter',
          representedParty: '1'
        }
      ]
    };
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.confirmActualHearingTimeForDay(hearingDay);
    component.confirmActualPartiesForDay(hearingDay);
    expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
  });

  it('should return only one date if only one hearing date', () => {
    const mainModel = _.cloneDeep(hearingActualsMainModel);
    const actualHearingDays = [mainModel.hearingActuals.actualHearingDays[0]];
    const s = component.calculateEarliestHearingDate(actualHearingDays);
    expect(s).toBe('12 Mar 2021');
  });

  it('should calculate return first and last hearing date as string', () => {
    const mainModel = _.cloneDeep(hearingActualsMainModel);
    const hearingDays = ActualHearingsUtils.getActualHearingDays(mainModel, false);
    const day = hearingDays[0];
    const obj1 = Object.assign({}, day, { hearingDate: '2021-03-13' });
    const obj2 = Object.assign({}, day, { hearingDate: '2021-03-15' });
    hearingDays.push(obj1);
    hearingDays.push(obj2);
    const s = component.calculateEarliestHearingDate(hearingDays);
    expect(s).toBe('12 Mar 2021 - 14 Mar 2021');
  });

  it('should return hearing date(s) text as string', () => {
    const mainModel = _.cloneDeep(hearingActualsMainModel);
    const hearingDays = ActualHearingsUtils.getActualHearingDays(mainModel, false);
    const day = hearingDays[0];
    const obj1 = Object.assign({}, day, { hearingDate: '2021-03-13' });
    const obj2 = Object.assign({}, day, { hearingDate: '2021-03-15' });
    hearingDays.push(obj1);
    hearingDays.push(obj2);
    component.actualHearingDays = hearingDays;
    const s = component.getHearingDateText();
    expect(s).toBe('Hearing date(s)');
  });

  it('should return hearing date text as string', () => {
    const mainModel = _.cloneDeep(hearingActualsMainModel);
    let hearingDays = ActualHearingsUtils.getActualHearingDays(mainModel, false);
    hearingDays = hearingDays.splice(0, 1);
    component.actualHearingDays = hearingDays;
    const s = component.getHearingDateText();
    expect(s).toBe('Hearing date');
  });

  it('should return updated notRequired', () => {
    const patchedHearingActuals = ActualHearingsUtils.mergeSingleHearingPartActuals(component.hearingActualsMainModel, component.actualHearingDays[0].hearingDate, { notRequired: true } as ActualHearingDayModel);
    expect(patchedHearingActuals.actualHearingDays[0].notRequired).toBe(true);
  });

  describe('getPauseDateTime', () => {
    it('should return start time', () => {
      const actualHearingDays = {
        hearingDate: '2021-03-12',
        hearingStartTime: '2021-03-12T09:00:00.000Z',
        hearingEndTime: '2021-03-12T10:00:00.000Z',
        pauseDateTimes: [{
          pauseStartTime: '2021-03-12T10:10:00.000Z',
          pauseEndTime: '2021-03-12T11:15:00.000Z'
        }],
        notRequired: false,
        actualDayParties: []
      };
      const actual = component.getPauseDateTime(actualHearingDays, 'start');
      expect(actual).toEqual('10:10');
    });

    it('should return end time', () => {
      const actualHearingDays = {
        hearingDate: '2021-03-12',
        hearingStartTime: '2021-03-12T09:00:00.000Z',
        hearingEndTime: '2021-03-12T10:00:00.000Z',
        pauseDateTimes: [{
          pauseStartTime: '2021-03-12T10:10:00.000Z',
          pauseEndTime: '2021-03-12T11:15:00.000Z'
        }],
        notRequired: false,
        actualDayParties: []
      };
      const actual = component.getPauseDateTime(actualHearingDays, 'end');
      expect(actual).toEqual('11:15');
    });

    it('should return null as no pause times are present', () => {
      const actualHearingDays = {
        hearingDate: '2021-03-12',
        hearingStartTime: '2021-03-12T09:00:00.000Z',
        hearingEndTime: '2021-03-12T10:00:00.000Z',
        pauseDateTimes: [],
        notRequired: false,
        actualDayParties: []
      };
      const actual = component.getPauseDateTime(actualHearingDays, 'start');
      expect(actual).toEqual(null);
    });
  });

  describe('hearingIsInFuture', () => {
    it('should return true if hearing date is in the future', () => {
      const hearingDate = '2050-01-01';
      const result = component.hearingIsInFuture(hearingDate);
      expect(result).toEqual(true);
    });

    it('should return false if hearing date is in the past', () => {
      const hearingDate = '2021-01-01';
      const result = component.hearingIsInFuture(hearingDate);
      expect(result).toEqual(false);
    });

    it('should return false if the hearing date is the current date', () => {
      const currentDate = new Date().toString();
      const result = component.hearingIsInFuture(currentDate);
      expect(result).toBe(false);
    });
  });

  describe('disable confirm button where participant changes have been made', () => {
    it('There is no difference in number of participants, return true', () => {
      const participantChange = component.haveParticipantsBeenAdded(component.actualHearingDays[0]);
      expect(participantChange).toBe(true);
    });
  });
  it('There are no changes in the number of participants, return false', () => {
    const newIndividual1 : IndividualDetailsModel ={
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      preferredHearingChannel: 'inPerson'
    };
    const newIndividual2 : IndividualDetailsModel ={
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      preferredHearingChannel: 'inPerson'
    };
    const newParty1 : PartyDetailsModel ={
      partyID: 'P2',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      partyName: 'John Doe',
      individualDetails: newIndividual1
    };
    const newParty2 : PartyDetailsModel ={
      partyID: 'P2',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      partyName: 'John Doe',
      individualDetails: newIndividual2
    };
    component.individualParties.push(newParty1);
    component.individualParties.push(newParty2);
    const participantChange = component.haveParticipantsBeenAdded(component.actualHearingDays[0]);
    expect(participantChange).toBe(false);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
