import { Location } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CaseField,
  CaseNotifier,
  CasesService,
  QualifyingQuestionService,
  CaseView,
  FieldType,
  FormDocument,
  QualifyingQuestionsErrorMessage,
  QueryCreateContext,
  QueryWriteRaiseQueryComponent,
  QueryWriteRespondToQueryComponent
} from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { RaiseQueryErrorMessage } from '../../models/raise-query-error-message.enum';
import { QueryManagementContainerComponent } from './query-management-container.component';

@Pipe({ name: 'rpxTranslate' })
class MockRpxTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('QueryManagementContainerComponent', () => {
  let component: QueryManagementContainerComponent;
  let fixture: ComponentFixture<QueryManagementContainerComponent>;
  let activatedRoute: ActivatedRoute;
  const mockRouter = {

    events: of(new NavigationStart(1, '/some-other-route')),
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  const mockFeatureToggleService = jasmine.createSpyObj('featureToggleService', ['getValue']);
  let router: Router;

  const locationMock = jasmine.createSpyObj('Location', ['back']);
  const CASE_VIEW: CaseView = {
    case_id: '123',
    case_type: {
      id: 'TestAddressBookCase',
      name: 'Test Address Book Case',
      jurisdiction: {
        id: 'TEST',
        name: 'Test'
      }
    },
    channels: [],
    state: {
      id: 'CaseCreated',
      name: 'Case created'
    },
    tabs: [],
    triggers: [],
    events: []
  };

  const eventMockData = {
    id: 'queryManagementRaiseQuery',
    name: 'queryManagementRaiseQuery',
    description: 'Respond to a query',
    event_token: 'token0011223344',

    case_fields: [
      {
        field_type: {
          collection_field_type: null,
          complex_fields: [],
          fixed_list_items: [],
          id: 'ComponentLauncher',
          max: null,
          min: null,
          regular_expression: null,
          type: 'ComponentLauncher'
        } as FieldType,
        id: 'QueryManagement1',
        label: 'Query management component'
      } as CaseField,
      {
        field_type: {
          collection_field_type: null,
          complex_fields: [],
          fixed_list_items: [],
          id: 'CaseQueriesCollection',
          max: null,
          min: null,
          regular_expression: null,
          type: 'Complex'
        } as FieldType,
        id: 'qmCaseQueriesCollection',
        label: 'Query management case queries collection',
        value: {
          caseMessages: [{
            id: '42ea7fd3-178c-4584-b48b-f1275bf1804f',
            value: {
              attachments: [],
              body: 'testing by olu',
              createdBy: '120b3665-0b8a-4e80-ace0-01d8d63c1005',
              createdOn: new Date('2024-08-27T15:44:50.700Z'),
              hearingDate: '2023-01-10',
              id: 'id-007',
              isHearingRelated: 'Yes',
              name: 'Piran Sam',
              parentId: 'ca',
              subject: 'Review attached document'
            }
          }],
          partyName: '',
          roleOnCase: ''
        }
      },
      {
        field_type: {
          collection_field_type: null,
          complex_fields: [],
          fixed_list_items: [],
          id: 'CaseQueriesCollection',
          max: null,
          min: null,
          regular_expression: null,
          type: 'Complex'
        } as FieldType,
        id: 'qmCaseQueriesCollection1',
        label: 'Query management case queries collection',
        value: {
          caseMessages: [{
            id: '42ea7fd3-178c-4584-b48b-f1275bf1804f',
            value: {
              attachments: [],
              body: 'testing by olu',
              createdBy: '120b3665-0b8a-4e80-ace0-01d8d63c10051',
              createdOn: new Date('2024-08-27T15:44:50.700Z'),
              hearingDate: '2023-01-10',
              id: 'id-007',
              isHearingRelated: 'Yes',
              name: 'Piran Sam',
              parentId: 'ca',
              subject: 'Review attached document'
            }
          }],
          partyName: '',
          roleOnCase: ''
        }
      } as CaseField
    ],
    wizard_pages: [],
    hasFields(): boolean {
      return true;
    },
    hasPages(): boolean {
      return false;
    }
  };

  const roleAssignmentInfo = [
    { substantive: 'Y',
      caseId: '123',
      jurisdiction: 'PUBLICLAW',
      isCaseAllocator: false,
      roleType: 'CASE',
      roleName: '[SOLICITORA]',
      beginTime: '2022-12-18T18:08:48.526067Z'
    }
  ];

  const casesService = jasmine.createSpyObj('casesService', ['caseView', 'getEventTrigger', 'createEvent', 'getCaseViewV2', 'cachedCaseView']);
  const qualifyingQuestionService = jasmine.createSpyObj('qualifyingQuestionService', ['setQualifyingQuestionSelection', 'clearQualifyingQuestionSelection']);
  const mockCaseNotifier = new CaseNotifier(casesService);
  mockCaseNotifier.caseView = new BehaviorSubject(CASE_VIEW).asObservable();
  casesService.getEventTrigger.and.returnValue(of(eventMockData));
  casesService.createEvent.and.returnValue(of({ status: 200 }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueryManagementContainerComponent,
        QueryWriteRaiseQueryComponent,
        QueryWriteRespondToQueryComponent,
        MockRpxTranslatePipe
      ],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            appConfig: {
              userDetails: {
                userInfo: {
                  name: 'Test User'
                },
                roleAssignmentInfo
              }
            }
          }
        }),
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                case: CASE_VIEW
              },
              params: {
                cid: '123',
                dataid: 'id-007'
              }
            }
          }
        },
        { provide: QualifyingQuestionService, useValue: qualifyingQuestionService },
        { provide: CasesService, useValue: casesService },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: locationMock },
        { provide: CaseNotifier, useValue: mockCaseNotifier },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryManagementContainerComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('showResponseForm - should not show summary', () => {
    component.showResponseForm();
    expect(component.showSummary).toBeFalsy();
  });

  it('showConfirmationPage - should show confirmation page', () => {
    component.showConfirmationPage();
    expect(component.showSummary).toEqual(false);
    expect(component.showConfirmation).toEqual(true);
  });

  it('should navigate to previous page', () => {
    component.previous();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should navigate to qualifying questions selection page', () => {
    component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL;
    component.previous();
    expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
  });

  it('should set showContinueButton to true when navigating back from qualifying question detail if showContinueButton was previously set to false', () => {
    component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL;
    component.showContinueButton = false;

    component.previous();

    expect(component.showContinueButton).toBeTruthy();
    expect(qualifyingQuestionService.clearQualifyingQuestionSelection).toHaveBeenCalled();
    expect(component.queryCreateContext).toBe(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
  });

  describe('when it does not have a query id', () => {
    it('should set the query create context', () => {
      expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
    });

    it('should not set the query item', () => {
      expect(component.queryItem).toBeUndefined();
    });

    it('should set the queryCreateContext to be query item type of new query qualifying question options', () => {
      expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
    });

    it('should have the ccd-qualifying-question-options component', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('ccd-qualifying-question-options')).toBeTruthy();
    });

    it('should have required validators for subject and isHearingRelated', () => {
      const subjectControl = component.formGroup.get('subject');
      const isHearingRelatedControl = component.formGroup.get('isHearingRelated');

      subjectControl.setValue(null);
      isHearingRelatedControl.setValue(null);

      expect(subjectControl.hasError('required')).toBe(true);
      expect(isHearingRelatedControl.hasError('required')).toBe(true);
    });
  });

  describe('when it has a query id', () => {
    beforeEach(() => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '123'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set the query item', () => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '4'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      expect(component.queryCreateContext).toEqual(QueryCreateContext.FOLLOWUP);
      expect(component.queryItem).toBeDefined();
    });

    it('should set follow question up to the right object', () => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '4',
          dataid: 'id-007'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      expect(component.queryItem.id).toEqual('id-007');
      expect(component.queryItem.subject).toEqual('Review attached document');
      expect(component.queryItem.name).toEqual('Piran Sam');
      expect(component.queryItem.body).toEqual('testing by olu');
      expect(component.queryItem.attachments).toEqual([]);
      expect(component.queryItem.isHearingRelated).toEqual('Yes');
      expect(component.queryItem.hearingDate).toEqual('2023-01-10');
      expect(component.queryItem.createdOn).toEqual(new Date('2024-08-27T15:44:50.700Z'));
      expect(component.queryItem.createdBy).toEqual('120b3665-0b8a-4e80-ace0-01d8d63c1005');
    });

    describe('raiseAQuery', () => {
      beforeEach(() => {
        activatedRoute.snapshot = {
          ...activatedRoute.snapshot,
          params: {
            ...activatedRoute.snapshot.params,
            qid: 'raiseAQuery'
          }
        } as unknown as ActivatedRouteSnapshot;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should have the ccd-query-write-raise-query component', () => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('ccd-query-write-raise-query')).toBeTruthy();
      });
    });

    it('should not have required validators for subject and isHearingRelated', () => {
      const subjectControl = component.formGroup.get('subject');
      const isHearingRelatedControl = component.formGroup.get('isHearingRelated');

      subjectControl.setValue(null);
      isHearingRelatedControl.setValue(null);

      expect(subjectControl.hasError('required')).toBe(false);
      expect(isHearingRelatedControl.hasError('required')).toBe(false);
    });
  });

  describe('when it has not a query id', () => {
    it('should log an error, set eventDataError to true', () => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '4',
          dataid: 'id-00EEE7'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();

      expect(component.eventDataError).toBe(true);
      expect(component.errorMessages.length).toBe(1);
      expect(component.errorMessages[0]).toEqual({
        title: '',
        description: 'This case is not configured for query management.',
        fieldId: 'caseNotFoundError'
      });
    });

    it('should log an error, set eventDataError to true', () => {
      const modifiedMockData = {
        ...eventMockData,
        case_fields: eventMockData.case_fields.map((field) => ({
          ...field,
          value: null
        }))
      };
      casesService.getEventTrigger.and.returnValue(of(modifiedMockData));

      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '4',
          dataid: 'id-00EEE7'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();

      expect(component.eventDataError).toBe(true);
      expect(component.errorMessages.length).toBe(1);
      expect(component.errorMessages[0]).toEqual({
        title: '',
        description: 'This case is not configured for query management.',
        fieldId: 'caseNotFoundError'
      });
    });
  });
  describe('onDocumentCollectionUpdate', () => {
    beforeEach(() => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: 'raiseAQuery'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set documents value', () => {
      const documents: FormDocument[] = [
        {
          document_filename: 'file1',
          document_url: 'url1',
          document_binary_url: 'binary_url1'
        },
        {
          document_filename: 'file2',
          document_url: 'url2',
          document_binary_url: 'binary_url2'
        }
      ];

      component.onDocumentCollectionUpdate(documents);
      expect(component.formGroup.get('attachments').value).toEqual([
        {
          _links: {
            self: {
              href: documents[0].document_url
            },
            binary: {
              href: documents[0].document_binary_url
            }
          },
          originalDocumentName: documents[0].document_filename
        },
        {
          _links: {
            self: {
              href: documents[1].document_url
            },
            binary: {
              href: documents[1].document_binary_url
            }
          },
          originalDocumentName: documents[1].document_filename
        }
      ]);
    });
  });

  describe('onContinue', () => {
    it('should set submitted to true and initiate form validation', () => {
      spyOn(component, 'validateForm');
      component.queryCreateContext = QueryCreateContext.NEW_QUERY;
      component.submitForm();
      expect(component.submitted).toEqual(true);
      expect(component.validateForm).toHaveBeenCalled();
    });
  });

  describe('submitForm', () => {
    it('should set submitted to true and initiate form validation', () => {
      spyOn(component, 'validateForm');
      component.queryCreateContext = QueryCreateContext.NEW_QUERY;
      component.submitForm();
      expect(component.validateForm).toHaveBeenCalled();
    });

    it('should show error message for new query submission', () => {
      spyOn(component, 'validateForm');
      component.queryCreateContext = QueryCreateContext.NEW_QUERY;
      component.eventDataError = true;
      component.submitForm();
      expect(component.submitted).toEqual(true);
      expect(component.validateForm).toHaveBeenCalled();
    });

    it('should navigate to raise a new query page after qualifying question is selected', () => {
      spyOn(component, 'validateForm');
      component.qualifyingQuestion = {
        name: 'Raise a new query',
        markdown: '',
        url: `/query-management/query/123/${QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION}}`
      };
      fixture.detectChanges();
      component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL;
      component.submitForm();
      expect(component.showSummary).toEqual(false);
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
      expect(component.validateForm).not.toHaveBeenCalled();
    });

    describe('queryCreateContext is QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS', () => {
      beforeEach(() => {
        component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS;
      });

      it('should mark control as touched', () => {
        spyOn(component.qualifyingQuestionsControl, 'markAsTouched');
        component.submitForm();
        expect(component.qualifyingQuestionsControl.markAsTouched).toHaveBeenCalled();
      });

      describe('qualifyingQuestionsControl is valid', () => {
        const qualifyingQuestion = {
          name: 'Raise a new query',
          markdown: '<p>Test markdown</p>',
          url: `/query-management/query/123/${QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION}`
        };
        beforeEach(() => {
          component.qualifyingQuestionsControl.setValue(qualifyingQuestion);
        });

        it('should set queryCreateContext to QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL', () => {
          spyOn(component, 'validateQualifyingQuestion').and.returnValue(true);
          component.submitForm();
          expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL);
        });

        it('should not change the queryCreateContext if qualifying questions validation failed', () => {
          spyOn(component, 'validateQualifyingQuestion').and.returnValue(false);
          component.submitForm();
          expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
        });

        it('should not show continue button if url is empty', () => {
          const qualifyingQuestion = {
            name: 'Raise a new query',
            markdown: '<p>Test markdown</p>',
            url: ''
          };

          component.qualifyingQuestionsControl.setValue(qualifyingQuestion);

          spyOn(component, 'validateQualifyingQuestion').and.returnValue(true);
          component.submitForm();
          expect(component.showContinueButton).toBe(false);
          expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL);
        });
      });

      describe('qualifyingQuestionsControl is valid with empty markdown', () => {
        const qualifyingQuestion = {
          name: 'Raise a new query',
          markdown: '',
          url: `/query-management/query/123/${QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION}`
        };
        beforeEach(() => {
          component.qualifyingQuestionsControl.setValue(qualifyingQuestion);
        });

        it('should not change queryCreateContext and navigate to the URL specified in the config', () => {
          spyOn(component, 'validateQualifyingQuestion').and.returnValue(true);
          component.submitForm();
          expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/query-management/query/123/${QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION}`);
        });

        it('should not change the queryCreateContext if qualifying questions validation failed', () => {
          spyOn(component, 'validateQualifyingQuestion').and.returnValue(false);
          component.submitForm();
          expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
        });
      });

      describe('qualifyingQuestionsControl is not valid', () => {
        beforeEach(() => {
          component.qualifyingQuestionsControl.setValue(null);
        });

        it('should set error messages when control is empty', () => {
          component.submitForm();
          expect(component.errorMessages).toEqual([
            {
              title: '',
              description: QualifyingQuestionsErrorMessage.SELECT_AN_OPTION,
              fieldId: 'qualifyingQuestionsOption'
            }
          ]);
        });

        it('should scroll to top', () => {
          spyOn(window, 'scrollTo');
          component.submitForm();
          expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'smooth' });
        });
      });
    });
  });

  describe('validateForm', () => {
    beforeEach(() => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should validate the form', () => {
      const nativeElement = fixture.debugElement.nativeElement;
      component.formGroup.get('subject').setValue('');
      component.formGroup.get('body').setValue('');
      component.submitForm();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.govuk-error-summary')).toBeDefined();

      component.formGroup.get('subject').setValue('Bring relatives');
      component.formGroup.get('body').setValue('Can I bring my grandma with me so she get out from the residence?');
      component.formGroup.get('isHearingRelated').setValue(false);
      component.submitForm();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    });

    it('should navigate to error element', () => {
      const nativeElement = document.getElementById('isHearingRelated-no');
      spyOn(nativeElement, 'focus');
      spyOn(nativeElement, 'scrollIntoView');
      component.navigateToErrorElement('isHearingRelated-no');
      fixture.detectChanges();
      expect(nativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
      expect(nativeElement.focus).toHaveBeenCalled();
    });

    it('should set query is related error message', () => {
      component.formGroup.get('isHearingRelated').setValue(null);
      component.validateForm();
      fixture.detectChanges();
      const error = {
        title: '',
        description: RaiseQueryErrorMessage.QUERY_HEARING_RELATED,
        fieldId: 'isHearingRelated-yes'
      };
      expect(component.errorMessages).toContain(error);
    });

    it('should set enter valid date error message', () => {
      component.formGroup.get('isHearingRelated').setValue(true);
      component.validateForm();
      fixture.detectChanges();
      const error = {
        title: '',
        description: RaiseQueryErrorMessage.QUERY_HEARING_DATE,
        fieldId: 'hearingDate-day'
      };
      expect(component.errorMessages).toContain(error);
    });
  });

  describe('validateQualifyingQuestion', () => {
    it('should return true with no error message', () => {
      const qualifyingQuestion = {
        name: 'Raise a new query',
        markdown: '',
        url: `/query-management/query/123/${QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION}`
      };
      component.qualifyingQuestionsControl.setValue(qualifyingQuestion);
      component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS;
      expect(component.validateQualifyingQuestion()).toEqual(true);
      expect(component.qualifyingQuestionsControl.valid).toBe(true);
    });

    it('should return false with error message', () => {
      component.qualifyingQuestionsControl.setValue(null);
      component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS;
      expect(component.validateQualifyingQuestion()).toEqual(false);
      expect(component.qualifyingQuestionsControl.valid).toBe(false);
      expect(component.errorMessages[0]).toEqual({
        title: '',
        description: QualifyingQuestionsErrorMessage.SELECT_AN_OPTION,
        fieldId: 'qualifyingQuestionsOption'
      });
    });
  });

  describe('cancel navigation', () => {
    it('should navigate to case overview tab', () => {
      component.navigateToCaseOverviewTab();
      expect(router.navigate).toHaveBeenCalledWith(['cases', 'case-details', component.caseId],
        { fragment: 'Overview' }
      );
    });
  });

  describe('navigateToCaseOverviewTab', () => {
    it('should navigate to case overview tab', () => {
      component.navigateToCaseOverviewTab();
      expect(router.navigate).toHaveBeenCalledWith(['cases', 'case-details', component.caseId],
        { fragment: 'Overview' }
      );
    });
  });

  describe('navigateToCaseTaskTab', () => {
    it('should navigate to case tasks tab', () => {
      component.navigateToCaseTaskTab();
      expect(router.navigate).toHaveBeenCalledWith(['cases', 'case-details', component.caseId],
        { fragment: 'tasks' }
      );
    });
  });

  describe('goToQueryList', () => {
    it('should navigate to case Queries tab', () => {
      component.goToQueryList();
      expect(router.navigate).toHaveBeenCalledWith(['cases', 'case-details', component.caseId],
        { fragment: 'Queries' }
      );
    });
  });

  describe('getQueryCreateContext', () => {
    it('should return query item type respond as the query context', () => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '3'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      expect(component.queryCreateContext).toEqual(QueryCreateContext.RESPOND);
    });

    it('should return query item type follow up as the query context', () => {
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '4'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      expect(component.queryCreateContext).toEqual(QueryCreateContext.FOLLOWUP);
    });

    it('should return query item type new query qualifying question options as the query context', () => {
      component.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL;
      activatedRoute.snapshot = {
        ...activatedRoute.snapshot,
        params: {
          ...activatedRoute.snapshot.params,
          qid: '5'
        }
      } as unknown as ActivatedRouteSnapshot;
      component.ngOnInit();
      expect(component.queryCreateContext).toEqual(QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS);
    });
  });

  describe('getEventTrigger', () => {
    it('should handle error correctly when getEventTrigger fails', () => {
      // Mock the service to return an error
      const errorMock = new Error('Network error');
      casesService.getEventTrigger.and.returnValue(throwError(() => errorMock));

      component.queryCreateContext = QueryCreateContext.NEW_QUERY;
      // eslint-disable-next-line dot-notation
      component['getEventTrigger']();

      expect(component.eventDataError).toBe(true);

      // Verify that an error message is added to errorMessages
      expect(component.errorMessages.length).toBe(1);
      expect(component.errorMessages[0]).toEqual({
        title: '',
        description: 'Something unexpected happened. please try again later.',
        fieldId: 'evenDataError'
      });
    });
  });

  describe('Extra Qualifying questions Option', () => {
    const qualifyingQuestions = [
      { name: 'Question 1', markdown: 'Details 1', url: 'http://example.com/1' },
      { name: 'Question 2', markdown: 'Details 2', url: 'http://example.com/2' }
    ];

    beforeEach(() => {
      mockFeatureToggleService.getValue.and.returnValue(of(qualifyingQuestions));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should retrieve and process qualifying questions', () => {
      component.qualifyingQuestions$.subscribe((qualifyingQuestions) => {
        expect(qualifyingQuestions[0].name).toBe('Follow-up on an existing query');
        expect(qualifyingQuestions[0].url).toContain('/cases/case-details/123#Queries');
        expect(qualifyingQuestions[1].name).toBe('Raise a new query');
      });
    });
  });
});
