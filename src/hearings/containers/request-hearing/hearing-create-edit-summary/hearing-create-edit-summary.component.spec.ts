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

describe('HearingCreateEditSummaryComponent', () => {
  let component: HearingCreateEditSummaryComponent;
  let fixture: ComponentFixture<HearingCreateEditSummaryComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  let screenFlow: ScreenNavigationModel[];
  let template: Section[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HearingCreateEditSummaryComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingCreateEditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    screenFlow = [
      {
        screenName: 'hearing-requirements',
        navigation: [
          {
            resultValue: 'hearing-facilities'
          }
        ]
      },
      {
        screenName: 'hearing-facilities',
        navigation: [
          {
            resultValue: 'hearing-stage'
          }
        ]
      },
      {
        screenName: 'hearing-stage',
        navigation: [
          {
            resultValue: 'hearing-attendance'
          }
        ]
      },
      {
        screenName: 'hearing-attendance',
        navigation: [
          {
            resultValue: 'hearing-venue'
          }
        ]
      }
    ];
    template = [
      {
        sectionHTMLTitle: '<h1 class="govuk-heading-l">Check your answers</h1>',
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
            changeLink: '/hearings/request/hearing-venue#inputLocationSearch'
          }
        ]
      },
      {
        sectionHTMLTitle: '<h2 class="govuk-heading-m">Additional facilities</h2>',
        screenName: 'hearing-facilities',
        answers: [
          {
            id: 'additionalSecurityRequired',
            answerTitle: 'Will additional security be required?',
            answerSource: AnswerSource.ADDITIONAL_SECURITY_REQUIRED,
            changeLink: '/hearings/request/hearing-facilities#additionalSecurityYes'
          },
          {
            id: 'additionalFacilitiesRequired',
            answerTitle: 'Select any additional facilities required',
            answerSource: AnswerSource.ADDITIONAL_FACILITIES_REQUIRED,
            changeLink: '/hearings/request/hearing-facilities#immigrationDetentionCentre'
          }
        ]
      },
      {
        sectionHTMLTitle: '<h2 class="govuk-heading-m">Stage</h2>',
        screenName: 'hearing-stage',
        answers: [
          {
            id: 'stage',
            answerTitle: 'What stage is this hearing at?',
            answerSource: AnswerSource.STAGE,
            changeLink: '/hearings/request/hearing-stage#initial'
          }
        ]
      },
      {
        sectionHTMLTitle: '<h2 class="govuk-heading-m">Participant attendance</h2>',
        screenName: 'hearing-attendance',
        answers: [
          {
            id: 'paperHearing',
            answerTitle: 'Will this be a paper hearing?',
            answerSource: AnswerSource.IS_PAPER_HEARING,
            changeLink: '/hearings/request/hearing-attendance#paperHearingYes'
          },
          {
            id: 'howParticipantsAttendant',
            answerTitle: 'What will be the methods of attendance for this hearing?',
            answerSource: AnswerSource.HOW_PARTICIPANTS_ATTEND,
            isHiddenSource: IsHiddenSource.PAPER_HEARING,
            changeLink: '/hearings/request/hearing-attendance#hearingLevelChannelList'
          },
          {
            id: 'howAttendant',
            answerTitle: 'How will each participant attend the hearing?',
            answerSource: AnswerSource.HOW_ATTENDANT,
            isHiddenSource: IsHiddenSource.PAPER_HEARING,
            changeLink: '/hearings/request/hearing-attendance#partyChannel0'
          },
          {
            id: 'attendantPersonAmount',
            answerTitle: 'How many people will attend the hearing in person?',
            answerSource: AnswerSource.ATTENDANT_PERSON_AMOUNT,
            isHiddenSource: IsHiddenSource.PAPER_HEARING,
            changeLink: '/hearings/request/hearing-attendance#attendance-number'
          }
        ]
      }
    ];
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
    component.removeUnnecessarySummaryTemplateItems();
    fixture.detectChanges();
    const sfCreateEditStore = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(screenFlow));
    component.getScreenFlowFromStore().subscribe((scr) => {
      expect(scr.length).toEqual(4);
      expect(template.length).toEqual(screenFlow.length + 1);

      const reducedSreeenFlowFlow = [screenFlow[1]];
      template = template.filter((tl: Section) => {
        return reducedSreeenFlowFlow.some((sr: ScreenNavigationModel) => {
          return tl.screenName.includes(sr.screenName) || tl.screenName.includes('check-answers');
        });
      });
      fixture.detectChanges();
      expect(template.length).toEqual(2);
      expect(sfCreateEditStore).toHaveBeenCalled();
    });
  });

  it('should display zero item if screen flow is empty', () => {
    component.removeUnnecessarySummaryTemplateItems();
    fixture.detectChanges();
    const sfCreateEditStore = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(screenFlow));
    component.getScreenFlowFromStore().subscribe(() => {
      expect(screenFlow.length).toEqual(4);
      expect(template.length).toEqual(screenFlow.length + 1);

      const reducedSreeenFlowFlow = [screenFlow[1]];
      template = template.filter((tl: Section) => {
        return reducedSreeenFlowFlow.some((sr: ScreenNavigationModel) => {
          return tl.screenName.includes(sr.screenName + '-unavailable-name');
        });
      });
      fixture.detectChanges();
      expect(template.length).toEqual(0);
      expect(sfCreateEditStore).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
