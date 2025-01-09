import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { hearingActualsMainModel, initialState } from '../../hearing.test.data';
import { LovRefDataModel } from '../../models/lovRefData.model';
import { ConvertToValuePipe } from '../../pipes/convert-to-value.pipe';
import { HearingAnswersPipe } from '../../pipes/hearing-answers.pipe';
import { HearingActualSummaryComponent } from './hearing-actual-summary.component';
import { DatePipe, FormatTranslatorService } from '@hmcts/ccd-case-ui-toolkit';

describe('HearingActualSummaryComponent', () => {
  let component: HearingActualSummaryComponent;
  let fixture: ComponentFixture<HearingActualSummaryComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockStore: any;
  const PARTY_CHANNELS: LovRefDataModel[] = [
    {
      key: 'inPerson',
      value_en: 'In person',
      value_cy: '',
      hint_text_en: 'in person',
      hint_text_cy: 'Wyneb yn wyneb',
      lov_order: 1,
      parent_key: null,
      category_key: 'HearingChannel',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      key: 'byPhone',
      value_en: 'By phone',
      value_cy: '',
      hint_text_en: 'By Phone',
      hint_text_cy: 'Ffôn',
      lov_order: 2,
      parent_key: null,
      category_key: 'HearingChannel',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: [
        {
          key: 'telephone-btMeetMe',
          value_en: 'Telephone - BTMeetme',
          value_cy: '',
          hint_text_en: 'By Phone bTMeetme',
          hint_text_cy: '',
          lov_order: 1,
          parent_key: 'byPhone',
          category_key: 'HearingChannel',
          parent_category: 'byPhone',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          key: 'telephone-CVP',
          value_en: 'Telephone - CVP',
          value_cy: '',
          hint_text_en: 'By Phone CVP',
          hint_text_cy: '',
          lov_order: 2,
          parent_key: 'byPhone',
          category_key: 'HearingChannel',
          parent_category: 'byPhone',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          key: 'telephone-other',
          value_en: 'Telephone - Other',
          value_cy: '',
          hint_text_en: 'By Phone Other',
          hint_text_cy: '',
          lov_order: 3,
          parent_key: 'byPhone',
          category_key: 'HearingChannel',
          parent_category: 'byPhone',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          key: 'telephone-skype',
          value_en: 'Telephone - Skype',
          value_cy: '',
          hint_text_en: 'By Phone Skype',
          hint_text_cy: '',
          lov_order: 4,
          parent_key: 'byPhone',
          category_key: 'HearingChannel',
          parent_category: 'byPhone',
          active_flag: 'Y',
          child_nodes: null
        }
      ]
    },
    {
      key: 'byVideo',
      value_en: 'By video',
      value_cy: 'Fideo',
      hint_text_en: 'By video',
      hint_text_cy: '',
      lov_order: 4,
      parent_key: null,
      category_key: 'HearingChannel',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: [
        {
          key: 'video-conference',
          value_en: 'Video Conference',
          value_cy: '',
          hint_text_en: 'By video conference',
          hint_text_cy: '',
          lov_order: 4,
          parent_key: 'byVideo',
          category_key: 'HearingChannel',
          parent_category: 'byVideo',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          key: 'video-other',
          value_en: 'Video - Other',
          value_cy: '',
          hint_text_en: 'By video other',
          hint_text_cy: '',
          lov_order: 4,
          parent_key: 'byVideo',
          category_key: 'HearingChannel',
          parent_category: 'byVideo',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          key: 'video-skype',
          value_en: 'Video - Skype',
          value_cy: '',
          hint_text_en: 'By video skype',
          hint_text_cy: '',
          lov_order: 4,
          parent_key: 'byVideo',
          category_key: 'HearingChannel',
          parent_category: 'byVideo',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          key: 'video-teams',
          value_en: 'Video - Teams',
          value_cy: '',
          hint_text_en: 'By video teams',
          hint_text_cy: '',
          lov_order: 4,
          parent_key: 'byVideo',
          category_key: 'HearingChannel',
          parent_category: 'byVideo',
          active_flag: 'Y',
          child_nodes: null
        }
      ]
    },
    {
      key: 'notAttending',
      value_en: 'Not attending',
      value_cy: '',
      hint_text_en: 'not attending',
      hint_text_cy: '',
      lov_order: 5,
      parent_key: null,
      category_key: 'HearingChannel',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];
  const HEARING_ROLES: LovRefDataModel[] = [
    {
      category_key: 'EntityRoleCode',
      key: 'APEL',
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
      key: 'APIN',
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
      key: 'JOPA',
      value_en: 'Joint Party',
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
      key: 'OTPA',
      value_en: 'Other Party',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Respondent',
      parent_key: 'RESP',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'RESP',
      value_en: 'Respondent',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'WERP',
      value_en: 'Welfare Representative',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Representative',
      parent_key: 'RPTT',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'LGRP',
      value_en: 'Legal Representative',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Representative',
      parent_key: 'RPTT',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'BARR',
      value_en: 'Barrister',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: 'Representative',
      parent_key: 'RPTT',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'INTP',
      value_en: 'Interpreter',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'RPTT',
      value_en: 'Representative',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'SUPP',
      value_en: 'Support',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'APPL',
      value_en: 'Applicant',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'EntityRoleCode',
      key: 'DEFE',
      value_en: 'Defendant',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];
  const HEARING_TYPES: LovRefDataModel[] = [
    {
      category_key: 'HearingType',
      key: 'BBA3-SUB',
      value_en: 'Substantive',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'HearingType',
      key: 'BBA3-DIR',
      value_en: 'Direction Hearings',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'HearingType',
      key: 'BBA3-CHA',
      value_en: 'Chambers Outcome',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [HearingActualSummaryComponent,
        HearingAnswersPipe, ConvertToValuePipe, MockRpxTranslatePipe, DatePipe
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                partyChannels: PARTY_CHANNELS,
                hearingRoles: HEARING_ROLES,
                hearingStageOptions: HEARING_TYPES
              }
            },
            fragment: of('point-to-me')
          }
        },
        DatePipe, FormatTranslatorService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    mockStore = TestBed.inject(Store);
    mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    fixture = TestBed.createComponent(HearingActualSummaryComponent);
    component = fixture.componentInstance;
    component.hearingActualsMainModel = hearingActualsMainModel;
    component.hearingState$ = new Observable();
    component.hearingStageOptions = HEARING_TYPES;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set hearing type description', () => {
    component.hearingActualsMainModel = {
      ...hearingActualsMainModel,
      hearingActuals: {
        ...hearingActualsMainModel.hearingActuals,
        hearingOutcome: {
          ...hearingActualsMainModel.hearingActuals.hearingOutcome,
          hearingType: 'BBA3-SUB'
        }
      }
    };
    fixture.detectChanges();
    expect(component.hearingTypeDescription).toEqual('Substantive');
  });

  it('should return hearing start time', () => {
    expect(component.actualHearingDate()).toEqual('2021-03-12T09:00:00.000Z');
  });

  it('should return true for multi days hearing', () => {
    expect(component.isMultiDayHearing).toEqual(true);
  });

  it('should return multi day hearing days', () => {
    expect(component.actualMultiDaysHearingDates()).toEqual('12 Mar 2021 - 14 Mar 2021');
  });

  it('should set empty hearing type description', () => {
    fixture.detectChanges();
    expect(component.hearingTypeDescription).toEqual('');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
