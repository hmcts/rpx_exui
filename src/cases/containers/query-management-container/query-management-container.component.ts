import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CaseNotifier,
  CaseView,
  Document,
  FormDocument,
  QualifyingQuestionsErrorMessage,
  QueryCreateContext,
  QueryListItem,
  CasesService,
  CaseEventTrigger,
  CaseField,
  QualifyingQuestionService
} from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { map, take } from 'rxjs/operators';
import { ErrorMessage } from '../../../app/models';
import { CaseTypeQualifyingQuestions } from '../../models/qualifying-questions/casetype-qualifying-questions.model';
import { QualifyingQuestion } from '../../models/qualifying-questions/qualifying-question.model';
import { RaiseQueryErrorMessage } from '../../models/raise-query-error-message.enum';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'exui-query-management-container',
  templateUrl: './query-management-container.component.html',
  styleUrls: ['./query-management-container.component.scss']
})
export class QueryManagementContainerComponent implements OnInit {
  private readonly LD_QUALIFYING_QUESTIONS = 'qm-qualifying-questions';
  private readonly RAISE_A_QUERY_NAME = 'Raise a new query';
  public static readonly RAISE_A_QUERY_QUESTION_OPTION = 'raiseAQuery';

  private static readonly QUERY_ITEM_QUALIFYING_QUESTION_DETAIL = '1';
  private static readonly QUERY_ITEM_RESPOND = '3';
  private static readonly QUERY_ITEM_FOLLOWUP = '4';

  private readonly RAISE_A_QUERY_EVENT_TRIGGER_ID = 'queryManagementRaiseQuery';
  private readonly RESPOND_TO_QUERY_EVENT_TRIGGER_ID = 'queryManagementRespondQuery';

  private static readonly caseLevelCaseFieldId = 'CaseQueriesCollection';
  public static readonly FIELD_TYPE_COLLECTION = 'Collection';
  public static readonly FIELD_TYPE_COMPLEX = 'Complex';

  private queryItemId: string;
  public caseId: string;
  public queryCreateContext: QueryCreateContext;
  public queryItem: QueryListItem | undefined;
  public showSummary = false;
  public showConfirmation = false;
  public formGroup: FormGroup = new FormGroup({});
  public submitted = false;
  public errorMessages: ErrorMessage[] = [];
  public queryCreateContextEnum = QueryCreateContext;
  public qualifyingQuestion: QualifyingQuestion;
  public qualifyingQuestions$: Observable<QualifyingQuestion[]>;
  public qualifyingQuestionsControl: FormControl;
  public eventDataError: boolean = false;
  public eventTrigger$: Observable<CaseEventTrigger>;
  public roleName: string;

  public caseDetails: CaseView;
  private readonly CASE_QUERIES_COLLECTION_ID = 'CaseQueriesCollection';
  public readonly FIELD_TYPE_COMPLEX = 'Complex';

  public eventTrigger: CaseEventTrigger;
  public eventData: CaseEventTrigger;
  public showContinueButton: boolean = true;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly caseNotifier: CaseNotifier,
    private readonly featureToggleService: FeatureToggleService,
    private readonly casesService: CasesService,
    private readonly store: Store<fromRoot.State>,
    private readonly qualifyingQuestionService: QualifyingQuestionService
  ) {}

  public ngOnInit(): void {
    this.caseId = this.activatedRoute.snapshot.params.cid;
    this.queryItemId = this.activatedRoute.snapshot.params.qid;
    this.queryCreateContext = this.getQueryCreateContext();
    this.qualifyingQuestions$ = this.getQualifyingQuestions();
    this.qualifyingQuestionsControl = new FormControl(null, Validators.required);

    this.formGroup = new FormGroup({
      subject: new FormControl(null),
      body: new FormControl(null, Validators.required),
      isHearingRelated: new FormControl(null),
      hearingDate: new FormControl(null),
      attachments: new FormControl([] as Document[])
    });

    if (this.queryItemId && this.queryItemId !== QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION) {
      if (this.queryCreateContext === QueryCreateContext.FOLLOWUP || this.queryCreateContext === QueryCreateContext.RESPOND) {
        this.getEventTrigger();
      }
    } else {
      this.formGroup.get('subject')?.setValidators([Validators.required]);
      this.formGroup.get('isHearingRelated')?.setValidators([Validators.required]);

      if (this.queryItemId && this.queryItemId === QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION) {
        this.getEventTrigger();
      }
    }
  }

  public showResponseForm(): void {
    this.showSummary = false;
  }

  public showConfirmationPage(): void {
    this.showSummary = false;
    this.showConfirmation = true;
  }

  public submitForm(): void {
    if (this.queryCreateContext === QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS) {
      this.handleQualifyingQuestions();
    } else if (this.queryCreateContext === QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL) {
      // Submit triggered from the markdown page, navigate to the URL provided in the config
      this.router.navigateByUrl(this.qualifyingQuestion?.url);
    } else {
      this.processFormSubmission();
    }
  }

  private handleQualifyingQuestions(): void {
    // Validate qualifying question selection
    if (this.validateQualifyingQuestion()) {
      // Submit triggered after selecting a qualifying question from qualifying questions radio options display page
      // Display the markdown page if markdown content is available, else navigate to the URL provided in the config
      this.qualifyingQuestion = this.qualifyingQuestionsControl.value;
      this.qualifyingQuestionService.setQualifyingQuestionSelection(this.qualifyingQuestion);

      if (this.qualifyingQuestion.markdown?.length) {
        this.queryCreateContext = this.getQueryCreateContext();
        if (!this.qualifyingQuestion.url) {
          this.showContinueButton = false; //Hide Continue button when when qualifying question has no url
        }
      } else {
        this.router.navigateByUrl(this.qualifyingQuestion.url);
      }
    }
  }

  private processFormSubmission(): void {
    // Show error message for follow up, new query submission
    if (this.eventDataError) {
      this.getEventTrigger();
      this.submitted = true;
      this.validateForm();
      return;
    }

    this.eventData = this.eventTrigger;
    this.showSummary = true;
    this.submitted = true;
    this.validateForm();
    this.showSummary = this.errorMessages?.length === 0;
    // Reset hearing date if isHearingRelated
    if (!this.formGroup.get('isHearingRelated').value) {
      this.formGroup.get('hearingDate').setValue(null);
    }
  }

  public onDocumentCollectionUpdate(uploadedDocuments: FormDocument[]): void {
    const attachments: Document[] = uploadedDocuments.map(
      (document) => ({
        _links: {
          self: {
            href: document.document_url
          },
          binary: {
            href: document.document_binary_url
          }
        },
        originalDocumentName: document.document_filename
      })
    );

    this.formGroup.get('attachments').setValue(attachments);
  }

  public previous(): void {
    if (this.queryCreateContext === QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL) {
      this.queryCreateContext = QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS;
      this.qualifyingQuestionService.clearQualifyingQuestionSelection();
      if (!this.showContinueButton) {
        this.showContinueButton = true;
      }
    } else {
      this.location.back();

      if (this.queryCreateContext !== QueryCreateContext.NEW_QUERY) {
        this.qualifyingQuestionService.clearQualifyingQuestionSelection();
      }
    }
  }

  public validateQualifyingQuestion(): boolean {
    this.errorMessages = [];
    if (this.queryCreateContext === QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS) {
      this.qualifyingQuestionsControl.markAsTouched();
      if (!this.qualifyingQuestionsControl.valid) {
        this.errorMessages = [
          {
            title: '',
            description: QualifyingQuestionsErrorMessage.SELECT_AN_OPTION,
            fieldId: 'qualifyingQuestionsOption'
          }
        ];
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        return false;
      }
    }
    return true;
  }

  public validateForm(): void {
    this.errorMessages = [];

    if (!this.formGroup.get('subject').valid) {
      this.addError(RaiseQueryErrorMessage.QUERY_SUBJECT, 'subject');
    }

    if (!this.formGroup.get('body').valid) {
      const raiseQueryErrorMessage = this.queryCreateContext === QueryCreateContext.RESPOND ?
        RaiseQueryErrorMessage.RESPOND_QUERY_BODY : RaiseQueryErrorMessage.QUERY_BODY;
      this.addError(raiseQueryErrorMessage, 'body');
    }

    if (!this.formGroup.get('isHearingRelated').valid) {
      this.addError(RaiseQueryErrorMessage.QUERY_HEARING_RELATED, 'isHearingRelated-yes');
    } else {
      if (this.formGroup.get('isHearingRelated').value === true &&
        this.formGroup.get('hearingDate').value === null) {
        this.addError(RaiseQueryErrorMessage.QUERY_HEARING_DATE, 'hearingDate-day');
      }
    }
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  private addError(message: string, field: string): void {
    this.errorMessages.push({
      title: '',
      description: message,
      fieldId: field
    });
  }

  public navigateToErrorElement(elementId: string): void {
    if (elementId) {
      const htmlElement = document.getElementById(elementId);
      if (htmlElement) {
        htmlElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        htmlElement.focus();
      }
    }
  }

  private getQueryCreateContext(): QueryCreateContext {
    switch (this.queryItemId) {
      case QueryManagementContainerComponent.QUERY_ITEM_QUALIFYING_QUESTION_DETAIL:
        return QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL;
      case QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION:
        return QueryCreateContext.NEW_QUERY;
      case QueryManagementContainerComponent.QUERY_ITEM_RESPOND:
        return QueryCreateContext.RESPOND;
      case QueryManagementContainerComponent.QUERY_ITEM_FOLLOWUP:
        return QueryCreateContext.FOLLOWUP;
      default:
        // When raise a query event is initiated, the queryItemId will be null for
        // both 'display of qualifying questions radio options' and 'display of markdown' pages
        // If the qualifying questions radio options are displayed then clicking on continue
        // must show the markdown of the selected qualifying question radio option, else just
        // display the qualifying questions radio options
        return this.queryCreateContext === QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS
          ? QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_DETAIL
          : QueryCreateContext.NEW_QUERY_QUALIFYING_QUESTION_OPTIONS;
    }
  }

  private getQualifyingQuestions(): Observable<QualifyingQuestion[]> {
    return combineLatest([
      this.caseNotifier.caseView,
      this.featureToggleService.getValue(this.LD_QUALIFYING_QUESTIONS, [])
    ]).pipe(
      map(([caseView, caseTypeQualifyingQuestions]: [CaseView, CaseTypeQualifyingQuestions[]]) => {
        this.caseId = caseView.case_id;
        const qualifyingQuestions: QualifyingQuestion[] = caseTypeQualifyingQuestions[caseView.case_type.id];
        if (!qualifyingQuestions.map((question) => question.name).includes(this.RAISE_A_QUERY_NAME)) {
          // Add the default qualifying question to the list if not present
          qualifyingQuestions.push({
            name: this.RAISE_A_QUERY_NAME,
            markdown: '',
            url: `/query-management/query/${this.caseId}/${QueryManagementContainerComponent.RAISE_A_QUERY_QUESTION_OPTION}`
          });
        }

        // Interpolate ${CCD_REFERENCE} in all qualifying questions
        qualifyingQuestions.forEach((question) => {
          if (question.url.includes('${CCD_REFERENCE}')) {
            question.url = question.url.replace('${CCD_REFERENCE}', this.caseId);
          }
        });
        return qualifyingQuestions;
      })
    );
  }

  public async goToQueryList(): Promise<void> {
    await this.router.navigate(['cases', 'case-details', this.caseId],
      { fragment: 'Query Management' }
    );
  }

  public async navigateToCaseOverviewTab(): Promise<void> {
    await this.router.navigate(['cases', 'case-details', this.caseId],
      { fragment: 'Overview' }
    );
  }

  public async navigateToCaseTaskTab(): Promise<void> {
    await this.router.navigate(['cases', 'case-details', this.caseId],
      { fragment: 'tasks' }
    );
  }

  private getEventTrigger():void {
    this.caseNotifier.caseView.pipe(take(1)).subscribe((caseDetails) => {
      this.caseDetails = caseDetails;

      if (this.queryCreateContext !== QueryCreateContext.RESPOND) {
        this.eventTrigger$ = this.casesService.getEventTrigger(undefined, this.RAISE_A_QUERY_EVENT_TRIGGER_ID, this.caseDetails.case_id);
      } else {
        this.eventTrigger$ = this.casesService.getEventTrigger(undefined, this.RESPOND_TO_QUERY_EVENT_TRIGGER_ID, this.caseDetails.case_id);
      }

      this.eventTrigger$.subscribe({
        next: (eventTrigger) => {
          this.eventTrigger = eventTrigger;

          if (this.queryCreateContext === QueryCreateContext.NEW_QUERY){
            this.caseQueriesCollectionsCount();
          }

          if (this.queryCreateContext === QueryCreateContext.FOLLOWUP || this.queryCreateContext === QueryCreateContext.RESPOND) {
            this.processFilteredMessages();
          }
        },
        error: (err) => {
          console.error('Error occurred while fetching event data:', err);
          this.eventDataError = true;
          this.addError('Something unexpected happened. please try again later.', 'evenDataError');
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // Workaround for multiple qmCaseQueriesCollections that are not to be appearing in the eventData
  // When creating a New Query, if caseQueriesCollections is more than one, then  the method getUserDetailsRoleName()
  private caseQueriesCollectionsCount() {
    const numberOfCaseQueriesCollections = this.eventTrigger?.case_fields?.filter(
      (caseField) =>
        caseField.field_type.id === this.CASE_QUERIES_COLLECTION_ID &&
        caseField.field_type.type === this.FIELD_TYPE_COMPLEX
    )?.length || 0;
    if (numberOfCaseQueriesCollections > 1) {
      this.getUserDetailsRoleName();
    }
  }

  // Workaround for multiple qmCaseQueriesCollections that are not to be appearing in the eventData
  private getUserDetailsRoleName(): void {
    this.store.pipe(select(fromRoot.getUserDetails)).subscribe((user) => {
      const matchedRoleAssignment = user.roleAssignmentInfo?.find(
        (m) => m.caseId === this.caseDetails.case_id
      );
      if (matchedRoleAssignment) {
        this.roleName = matchedRoleAssignment.roleName;
      } else {
        this.roleName = '';
      }
    });
  }

  // Function to filter and process the messages based on the event data
  private processFilteredMessages():void {
    const messageId = this.activatedRoute.snapshot.params.dataid;
    let caseQueriesCollections = [];

    if (this.eventTrigger?.case_fields?.length) {
      caseQueriesCollections = this.eventTrigger.case_fields.reduce((acc, caseField) => {
        const extractedCaseQueriesFromCaseField = this.extractCaseQueriesFromCaseField(caseField);

        if (extractedCaseQueriesFromCaseField && typeof extractedCaseQueriesFromCaseField === 'object') {
          acc.push(extractedCaseQueriesFromCaseField);
        }

        return acc;
      }, []);
    }
    const filteredMessages = caseQueriesCollections
      .map((caseData) => caseData.caseMessages) // Extract the caseMessages arrays
      .flat() // Flatten into a single array of messages
      .filter((message) => message.value.id === messageId); // Filter by message id

    if (filteredMessages.length > 0) {
      // Access matching message
      const matchingMessage = filteredMessages[0]?.value;

      if (matchingMessage) {
        this.queryItem = new QueryListItem();

        // Assign the matching message to queryItem
        Object.assign(this.queryItem, matchingMessage);
      }
    } else {
      //If queryItem shouldn't empty, and it is expected to have an id. IF it is empty then it is an error.
      console.error(`No messages found for messageId: ${messageId}`);
      this.eventDataError = true;
      this.addError('This case is not configured for query management.', 'caseNotFoundError');
    }
  }

  private extractCaseQueriesFromCaseField(caseField: CaseField) {
    const { field_type, value } = caseField;

    // Handle Complex type fields
    if (field_type.type === QueryManagementContainerComponent.FIELD_TYPE_COMPLEX) {
      if (field_type.id === QueryManagementContainerComponent.caseLevelCaseFieldId && this.isNonEmptyObject(value)) {
        return value;
      }
      return null;
    }
  }

  private isObject(elem: any): boolean {
    return typeof elem === 'object' && elem !== null;
  }

  private isNonEmptyObject(elem: any): boolean {
    return this.isObject(elem) && Object.keys(elem).length !== 0;
  }
}
