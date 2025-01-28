import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialState } from '../../../hearing.test.data';
import { ACTION, AnswerSource, IsHiddenSource } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { HearingCreateEditSummaryComponent } from './hearing-create-edit-summary.component';
import { Section } from '../../../../hearings/models/section';
import { ScreenNavigationModel } from 'api/hearings/models/screenNavigation.model';

let component: HearingCreateEditSummaryComponent;
let fixture: ComponentFixture<HearingCreateEditSummaryComponent>;
const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
const hearingsService = new HearingsService(mockedHttpClient);
hearingsService.navigateAction$ = of(ACTION.CONTINUE);
const screenFlow: ScreenNavigationModel[] = [
  {
    screenName: 'hearing-venue',
    conditionKey: 'regionId',
    navigation: [
      {
        conditionOperator: 'INCLUDE',
        conditionValue: '7',
        resultValue: 'hearing-welsh'
      },
      {
        conditionOperator: 'NOT INCLUDE',
        conditionValue: '7',
        resultValue: 'hearing-panel-required'
      }
    ]
  },
  {
    screenName: 'hearing-welsh',
    navigation: [
      {
        resultValue: 'hearing-panel-required'
      }
    ]
  },
  {
    screenName: 'hearing-panel-required',
    conditionKey: 'isAPanelFlag',
    navigation: [
      {
        conditionOperator: 'EQUALS',
        conditionValue: true,
        resultValue: 'hearing-panel'
      },
      {
        conditionOperator: 'EQUALS',
        conditionValue: false,
        resultValue: 'hearing-judge'
      }
    ]
  },
  {
    screenName: 'hearing-judge',
    navigation: [
      {
        resultValue: 'hearing-timing'
      }
    ]
  },
  {
    screenName: 'hearing-panel',
    navigation: [
      {
        resultValue: 'hearing-timing'
      }
    ]
  },
  {
    screenName: 'hearing-timing',
    navigation: [
      {
        resultValue: 'hearing-link'
      }
    ]
  }
];

const template: Section[] = [
  {
    sectionHTMLTitle: '<h1 class="govuk-heading-l">Check your answers before sending your request</h1>',
    screenName: 'check-answers',
    answers: [
      {
        id: 'caseName',
        answerTitle: 'Case name',
        answerSource: AnswerSource.CASE_NAME
      },
      {
        id: 'caseNumber',
        answerTitle: 'Case number',
        answerSource: AnswerSource.CASE_NUMBER
      },
      {
        id: 'type',
        answerTitle: 'Type',
        answerSource: AnswerSource.Type
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing venue</h2>',
    screenName: 'hearing-venue',
    answers: [
      {
        id: 'venue',
        answerTitle: 'What are the hearing venue details?',
        answerSource: AnswerSource.VENUE,
        changeLink: '/hearings/request/hearing-venue#inputLocationSearch',
        isAmendedSource: AnswerSource.VENUE
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Language requirements</h2>',
    screenName: 'hearing-welsh',
    answers: [
      {
        id: 'needWelsh',
        answerTitle: 'Does this hearing need to be in Welsh?',
        answerSource: AnswerSource.NEED_WELSH,
        changeLink: '/hearings/request/hearing-welsh#welsh_hearing_yes',
        isAmendedSource: AnswerSource.NEED_WELSH
      }
    ],
    isHiddenSource: IsHiddenSource.WELSH_LOCATION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing panel required</h2>',
    screenName: 'hearing-panel-required',
    answers: [
      {
        id: 'needPanel',
        answerTitle: 'Do you require a panel for this hearing?',
        answerSource: AnswerSource.NEED_PANEL,
        changeLink: '/hearings/request/hearing-panel-required#hearingPanelRequired',
        isAmendedSource: AnswerSource.NEED_PANEL
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Judge details</h2>',
    screenName: 'hearing-judge',
    answers: [
      {
        id: 'needJudge',
        answerTitle: 'Do you want a specific judge?',
        answerSource: AnswerSource.NEED_JUDGE,
        changeLink: '/hearings/request/hearing-judge#specificJudgeName',
        isAmendedSource: AnswerSource.NEED_JUDGE
      },
      {
        id: 'judgeName',
        answerTitle: 'Name of the judge',
        answerSource: AnswerSource.JUDGE_NAME,
        changeLink: '/hearings/request/hearing-judge#inputSelectPerson',
        isHiddenSource: IsHiddenSource.JUDGE_NAME,
        isAmendedSource: AnswerSource.JUDGE_NAME
      },
      {
        id: 'judgeTypes',
        answerTitle: 'Select all judge types that apply',
        answerSource: AnswerSource.JUDGE_TYPES,
        changeLink: '/hearings/request/hearing-judge#judgeTypes',
        isHiddenSource: IsHiddenSource.JUDGE_TYPES,
        isAmendedSource: AnswerSource.JUDGE_TYPES
      },
      {
        id: 'judgeExclusion',
        answerTitle: 'Exclude a judge',
        answerSource: AnswerSource.JUDGE_EXCLUSION,
        changeLink: '/hearings/request/hearing-judge#inputSelectPersonExclude',
        isHiddenSource: IsHiddenSource.JUDGE_EXCLUSION,
        isAmendedSource: AnswerSource.JUDGE_EXCLUSION
      }
    ]
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Panel details</h2>',
    screenName: 'hearing-panel',
    answers: [
      {
        id: 'hearingPanel',
        answerTitle: 'Do you require a panel for this hearing?',
        answerSource: AnswerSource.HEARING_PANEL,
        changeLink: '/hearings/request/hearing-panel#specificPanelSelection',
        isAmendedSource: AnswerSource.HEARING_PANEL
      },
      {
        id: 'panelInclusion',
        answerTitle: 'Include specific panel members',
        answerSource: AnswerSource.PANEL_INCLUSION,
        changeLink: '/hearings/request/hearing-panel#inputSelectPersonInclude',
        isHiddenSource: IsHiddenSource.PANEL_INCLUSION,
        isAmendedSource: AnswerSource.PANEL_INCLUSION
      },
      {
        id: 'panelExclusion',
        answerTitle: 'Exclude specific panel members',
        answerSource: AnswerSource.PANEL_EXCLUSION,
        changeLink: '/hearings/request/hearing-panel#inputSelectPersonExclude',
        isHiddenSource: IsHiddenSource.PANEL_EXCLUSION,
        isAmendedSource: AnswerSource.PANEL_EXCLUSION
      },
      {
        id: 'panelRoles',
        answerTitle: 'Select any other panel roles required',
        answerSource: AnswerSource.PANEL_ROLES,
        changeLink: '/hearings/request/hearing-panel#specificPanelSelection',
        isHiddenSource: IsHiddenSource.PANEL_ROLES,
        isAmendedSource: AnswerSource.PANEL_ROLES
      }
    ],
    isHiddenSource: IsHiddenSource.PANEL_DETAILS_EXCLUSION
  },
  {
    sectionHTMLTitle: '<h2 class="govuk-heading-m">Length, date and priority level of hearing</h2>',
    screenName: 'hearing-timing',
    answers: [
      {
        id: 'hearingLength',
        answerTitle: 'Length of hearing',
        answerSource: AnswerSource.HEARING_LENGTH,
        changeLink: '/hearings/request/hearing-timing#durationdays',
        isAmendedSource: AnswerSource.HEARING_LENGTH
      },
      {
        id: 'hearingSpecificDate',
        answerTitle: 'Does the hearing need to take place on a specific date?',
        answerSource: AnswerSource.HEARING_SPECIFIC_DATE,
        changeLink: '/hearings/request/hearing-timing#noSpecificDate',
        isAmendedSource: AnswerSource.HEARING_SPECIFIC_DATE
      },
      {
        id: 'hearingPriority',
        answerTitle: 'What is the priority of this hearing?',
        answerSource: AnswerSource.HEARING_PRIORITY,
        changeLink: '/hearings/request/hearing-timing#urgent',
        isAmendedSource: AnswerSource.HEARING_PRIORITY
      }
    ]
  }
];

describe('WHERE a panel is requested ensure the judge screen is removed.', () => {
  beforeEach(() => {
    const state = JSON.parse(JSON.stringify(initialState));
    state.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.isAPanelFlag = true;
    state.hearings.hearingValues.serviceHearingValuesModel.screenFlow = screenFlow;

    TestBed.configureTestingModule({
      declarations: [HearingCreateEditSummaryComponent],
      providers: [
        provideMockStore({ initialState: state }),
        { provide: HearingsService, useValue: hearingsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingCreateEditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeUnnecessarySummaryTemplateItems in ngOnInit', () => {
    const rmvSummaryTemp = spyOn(component, 'removeUnnecessarySummaryTemplateItems');
    component.ngOnInit();
    expect(hearingsService.hearingRequestForSubmitValid).toEqual(false);
    expect(rmvSummaryTemp).toHaveBeenCalled();
  });

  it('should call getScreenFlowFromStore ', () => {
    const store = [{ screenName: 'hearing-link', navigation: [] }];
    const screenFlow = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(store));
    component.removeUnnecessarySummaryTemplateItems();
    expect(screenFlow).toHaveBeenCalled();
  });

  it('should display fewer items when screenFlow is less', () => {
    let testTemplate:Section[] = JSON.parse(JSON.stringify(template));
    component.removeUnnecessarySummaryTemplateItems();
    fixture.detectChanges();
    expect(component.template[1].screenName).toEqual('hearing-venue');
    expect(component.template[2].screenName).toEqual('hearing-welsh');
    expect(component.template[3].screenName).toEqual('hearing-panel-required');
    expect(component.template[4].screenName).toEqual('hearing-panel');
    expect(component.template[5].screenName).toEqual('hearing-panel-selector');
    const sfCreateEditStore = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(screenFlow));
    component.getScreenFlowFromStore().subscribe((scr) => {
      expect(scr.length).toEqual(6);
      expect(testTemplate.length).toEqual(screenFlow.length + 1);

      const reducedSreeenFlowFlow = [screenFlow[1]];
      testTemplate = testTemplate.filter((tl: Section) => {
        return reducedSreeenFlowFlow.some((sr: ScreenNavigationModel) => {
          return tl.screenName.includes(sr.screenName) || tl.screenName.includes('check-answers');
        });
      });
      fixture.detectChanges();
      expect(testTemplate.length).toEqual(2);
      expect(sfCreateEditStore).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});

describe('WHERE a panel is not requested ensure the panel screen is removed.', () => {
  beforeEach(() => {
    const state = JSON.parse(JSON.stringify(initialState));
    state.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.isAPanelFlag = false;
    state.hearings.hearingValues.serviceHearingValuesModel.screenFlow = screenFlow;

    TestBed.configureTestingModule({
      declarations: [HearingCreateEditSummaryComponent],
      providers: [
        provideMockStore({ initialState: state }),
        { provide: HearingsService, useValue: hearingsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingCreateEditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('SHOULD not display the judge screen when panelRequired is set to true', () => {
    let testTemplate:Section[] = JSON.parse(JSON.stringify(template));
    component.removeUnnecessarySummaryTemplateItems();
    fixture.detectChanges();
    expect(component.template[1].screenName).toEqual('hearing-venue');
    expect(component.template[2].screenName).toEqual('hearing-welsh');
    expect(component.template[3].screenName).toEqual('hearing-panel-required');
    expect(component.template[4].screenName).toEqual('hearing-judge');
    expect(component.template[5].screenName).toEqual('hearing-timing');
    const sfCreateEditStore = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(screenFlow));
    component.getScreenFlowFromStore().subscribe((scr) => {
      expect(scr.length).toEqual(6);
      expect(testTemplate.length).toEqual(screenFlow.length + 1);

      const reducedSreeenFlowFlow = [screenFlow[1]];
      testTemplate = testTemplate.filter((tl: Section) => {
        return reducedSreeenFlowFlow.some((sr: ScreenNavigationModel) => {
          return tl.screenName.includes(sr.screenName) || tl.screenName.includes('check-answers');
        });
      });
      fixture.detectChanges();
      expect(testTemplate.length).toEqual(2);
      expect(sfCreateEditStore).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});

