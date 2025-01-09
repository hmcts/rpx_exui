import { Component, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { ActualHearingsUtils } from '../../../../hearings/utils/actual-hearings.utils';
import { hearingActualsMainModel, hearingStageRefData, initialState, partyChannelsRefData, partySubChannelsRefData } from '../../../hearing.test.data';
import { ActualHearingDayModel } from '../../../models/hearingActualsMainModel';
import { ACTION, HearingResult } from '../../../models/hearings.enum';
import { ConvertToValuePipe } from '../../../pipes/convert-to-value.pipe';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { HearingActualsEditSummaryComponent } from './hearing-actuals-edit-summary.component';
import { DatePipe, FormatTranslatorService } from '@hmcts/ccd-case-ui-toolkit';

@Pipe({ name: 'transformAnswer' })
export class MockHearingAnswersPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform(answerSource, hearingState$, index?: number): string {
    return '';
  }
}

@Component({
  template: `
    <div>Nothing</div>`
})
class NothingComponent {
}

describe('HearingActualSummaryComponent', () => {
  let component: HearingActualsEditSummaryComponent;
  let fixture: ComponentFixture<HearingActualsEditSummaryComponent>;
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
      declarations: [HearingActualsEditSummaryComponent, ConvertToValuePipe, MockHearingAnswersPipe, MockRpxTranslatePipe, DatePipe],
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
        FormatTranslatorService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingActualsEditSummaryComponent);
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

  it('should check back method', () => {
    spyOn(hearingsService, 'navigateAction');
    component.onBack();
    expect(hearingsService.navigateAction).toHaveBeenCalledWith(ACTION.BACK);
  });

  it('should return correct hearing type from the hearing types', () => {
    component.hearingTypes = hearingStageRefData;
    const description = component.getHearingTypeDescription('initial');
    expect(description).toEqual('Initial');
  });

  it('should submit hearing details', () => {
    component.actualHearingDays = hearingActualsMainModel.hearingActuals.actualHearingDays;
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.id = '1111222233334444';
    component.hearingResult = HearingResult.COMPLETED;
    component.onSubmitHearingDetails();
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.SubmitHearingActuals(component.id));
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
    const patchedHearingActuals = ActualHearingsUtils.mergeSingleHearingPartActuals(
      component.hearingActualsMainModel, component.actualHearingDays[0].hearingDate, { notRequired: true } as ActualHearingDayModel
    );
    expect(patchedHearingActuals.actualHearingDays[0].notRequired).toBe(true);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
