import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION, AnswerSource, IsHiddenSource } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { HearingViewEditSummaryComponent } from './hearing-view-edit-summary.component';
import { Section } from '../../../../hearings/models/section';
import { ScreenNavigationModel } from '../../../../hearings/models/screenNavigation.model';
import * as fromHearingStore from '../../../../hearings/store';

describe('HearingViewEditSummaryComponent', () => {
  let component: HearingViewEditSummaryComponent;
  let fixture: ComponentFixture<HearingViewEditSummaryComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  let screenFlow: ScreenNavigationModel[];
  let template: Section[];
  let mockStore: Store<fromHearingStore.State>;

  describe('getHearingRequestToCompare and getHearingRequest are holding different state', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HearingViewEditSummaryComponent, MockRpxTranslatePipe],
        providers: [
          LoadingService,
          provideMockStore({ initialState }),
          { provide: HearingsService, useValue: hearingsService }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
      fixture = TestBed.createComponent(HearingViewEditSummaryComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(Store);

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
          sectionHTMLTitle: '<h1 class="govuk-heading-l">View, Edit Hearing</h1>',
          screenName: 'edit-hearing',
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
          sectionHTMLTitle: '<h1 class="govuk-heading-l">Hearing Listing Info</h1>',
          screenName: 'hearing-listing-info',
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
          sectionHTMLTitle: '<h2 class="govuk-heading-m">Hearing requirements</h2>',
          screenName: 'hearing-requirements',
          answers: [
            {
              id: 'caseFlags',
              answerTitle: 'Reasonable adjustments',
              answerSource: AnswerSource.CASE_FLAGS,
              changeLink: '/hearings/request/hearing-requirements#linkAmendFlags'
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

    it('should call navigateAction when executeAction is called with a valid form', () => {
      component.executeAction(ACTION.VIEW_EDIT_REASON);
      expect(component.validationErrors.length).toEqual(0);
    });

    it('should call removeUnnecessarySummaryTemplateItems in ngOnInit', () => {
      const rmvSummaryTemp = spyOn(component, 'removeUnnecessarySummaryTemplateItems');
      component.ngOnInit();
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
      const sfStore = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(screenFlow));
      component.getScreenFlowFromStore().subscribe((scr) => {
        expect(scr.length).toEqual(4);
        expect(template.length).toEqual(screenFlow.length + 2);

        const reducedSreeenFlowFlow = [screenFlow[1]];
        template = template.filter((tl: Section) => {
          return reducedSreeenFlowFlow.some((sr: ScreenNavigationModel) => {
            return tl.screenName.includes(sr.screenName) || tl.screenName.includes('edit-hearing') || tl.screenName.includes('hearing-listing-info');
          });
        });
        fixture.detectChanges();
        expect(template.length).toEqual(3);
        expect(sfStore).toHaveBeenCalled();
      });
    });

    it('should display zero item if screen flow is empty', () => {
      component.removeUnnecessarySummaryTemplateItems();
      fixture.detectChanges();
      const scrFl = spyOn(component, 'getScreenFlowFromStore').and.returnValue(of(screenFlow));
      component.getScreenFlowFromStore().subscribe((scr) => {
        expect(scr.length).toEqual(4);
        expect(template.length).toEqual(screenFlow.length + 2);

        const reducedSreeenFlowFlow = [screenFlow[1]];
        template = template.filter((tl: Section) => {
          return reducedSreeenFlowFlow.some((sr: ScreenNavigationModel) => {
            return tl.screenName.includes(sr.screenName + 'fake-name');
          });
        });
        fixture.detectChanges();
        expect(template.length).toEqual(0);
        expect(scrFl).toHaveBeenCalled();
      });
    });

    it('should set requestError when there is an error', () => {
      const error = { errorMessage: 'Error Title', errorDescription: 'Error Description' };
      spyOn(mockStore, 'select').and.returnValue(of(error));
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.validationErrors).toEqual([{ id: 'judicialUserGetError', message: `Judicial user: ${error.errorDescription}` }]);
    });

    it('should not set requestError when there is no error', () => {
      spyOn(mockStore, 'select').and.returnValue(of(null));
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.requestError).toBeNull();
    });

    afterEach(() => {
      fixture.destroy();
    });
  });

  describe('getHearingRequestToCompare and getHearingRequest state are same', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HearingViewEditSummaryComponent, MockRpxTranslatePipe],
        providers: [
          provideMockStore({ initialState: { hearings: {} } }),
          { provide: HearingsService, useValue: hearingsService }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(HearingViewEditSummaryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have a validation errors mapped when nothing has changed summary page', () => {
      component.executeAction(ACTION.VIEW_EDIT_REASON);
      expect(component.validationErrors.length).toEqual(1);
    });

    afterEach(() => {
      fixture.destroy();
    });
  });
});
