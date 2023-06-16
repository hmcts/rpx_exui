import { CaseEventTrigger, createCaseEventTrigger, DRAFT_PREFIX, DRAFT_QUERY_PARAM, HttpError } from '@hmcts/ccd-case-ui-toolkit';
import { Observable, of, throwError } from 'rxjs';
import { CreateCaseEventTriggerResolver } from './create-case-event-trigger.resolver';
import createSpyObj = jasmine.createSpyObj;

describe('CreateCaseFieldsResolver', () => {
  const PARAM_JURISDICTION_ID = CreateCaseEventTriggerResolver.PARAM_JURISDICTION_ID;
  const PARAM_CASE_TYPE_ID = CreateCaseEventTriggerResolver.PARAM_CASE_TYPE_ID;
  const PARAM_EVENT_ID = CreateCaseEventTriggerResolver.PARAM_EVENT_ID;
  const QUERY_PARAM_IGNORE_WARNINGS = CreateCaseEventTriggerResolver.QUERY_PARAM_IGNORE_WARNING;
  const JURISDICTION = 'TEST';
  const IGNORE_WARNINGS = false;
  const CASE_TYPE = 'TestAddressBookCase';
  const EVENT_TRIGGER_ID = 'enterCaseIntoLegacy';
  const EVENT_TRIGGER: CaseEventTrigger = createCaseEventTrigger(EVENT_TRIGGER_ID, 'Into legacy', 'caseId', true, []);

  const DRAFT_ID = `${DRAFT_PREFIX}12345`;
  const EVENT_TRIGGER_OBS: Observable<CaseEventTrigger> = of(EVENT_TRIGGER);
  const ERROR: HttpError = {
    timestamp: '',
    status: 422,
    message: 'Validation failed',
    error: '',
    exception: '',
    path: ''
  };

  let createCaseFieldsResolver: CreateCaseEventTriggerResolver;

  let casesService: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let alertService: any;
  let route: any;

  beforeEach(async () => {
    casesService = createSpyObj('casesService', ['getEventTrigger']);
    alertService = createSpyObj('alertService', ['error']);

    createCaseFieldsResolver = new CreateCaseEventTriggerResolver(casesService);

    route = {
      paramMap: createSpyObj('paramMap', ['get']),
      queryParamMap: createSpyObj('queryParamMap', ['get'])
    };

    route.paramMap.get.and.callFake((key) => {
      switch (key) {
        case PARAM_JURISDICTION_ID:
          return JURISDICTION;
        case PARAM_CASE_TYPE_ID:
          return CASE_TYPE;
        case PARAM_EVENT_ID:
          return EVENT_TRIGGER_ID;
        default:
          break;
      }
    });

    route.queryParamMap.get.and.callFake((key) => {
      // tslint:disable-next-line:switch-default
      switch (key) {
        case QUERY_PARAM_IGNORE_WARNINGS:
          return IGNORE_WARNINGS;
      }
    });
  });

  it('should resolve event trigger and cache when route is :jid/:ctid/:eid', () => {
    casesService.getEventTrigger.and.returnValue(EVENT_TRIGGER_OBS);
    expect(createCaseFieldsResolver.cachedEventTrigger).toBeUndefined();

    createCaseFieldsResolver
      .resolve(route)
      .subscribe((triggerData) => {
        expect(triggerData).toBe(EVENT_TRIGGER);
      });

    expect(casesService.getEventTrigger).toHaveBeenCalledWith(
      CASE_TYPE, EVENT_TRIGGER_ID, undefined, String(IGNORE_WARNINGS));
    expect(route.paramMap.get).toHaveBeenCalledWith(PARAM_CASE_TYPE_ID);
    expect(route.paramMap.get).toHaveBeenCalledWith(PARAM_EVENT_ID);
    expect(route.queryParamMap.get).toHaveBeenCalledWith(QUERY_PARAM_IGNORE_WARNINGS);
    expect(route.queryParamMap.get).toHaveBeenCalledWith(DRAFT_QUERY_PARAM);
    expect(route.paramMap.get).toHaveBeenCalledTimes(2);
    expect(route.queryParamMap.get).toHaveBeenCalledTimes(2);
  });

  it('should resolve event trigger when route is not :jid/:ctid/:eid but cache is empty', () => {
    route = {
      firstChild: {
        url: ['someChild']
      },
      queryParamMap: createSpyObj('queryParamMap', ['get']),
      paramMap: createSpyObj('paramMap', ['get'])
    };
    casesService.getEventTrigger.and.returnValue(EVENT_TRIGGER_OBS);
    expect(createCaseFieldsResolver.cachedEventTrigger).toBeUndefined();

    createCaseFieldsResolver
      .resolve(route)
      .subscribe((triggerData) => {
        expect(triggerData).toBe(EVENT_TRIGGER);
      });

    expect(casesService.getEventTrigger).toHaveBeenCalled();
    expect(route.paramMap.get).toHaveBeenCalledWith(PARAM_EVENT_ID);
  });

  it('should return cached event trigger when route is not :jid/:ctid/:eid if cache is not empty', () => {
    route = {
      firstChild: {
        url: ['someChild']
      },
      queryParamMap: createSpyObj('queryParamMap', ['get']),
      paramMap: createSpyObj('paramMap', ['get'])
    };
    casesService.getEventTrigger.and.returnValue(EVENT_TRIGGER_OBS);
    createCaseFieldsResolver.cachedEventTrigger = EVENT_TRIGGER;

    createCaseFieldsResolver
      .resolve(route)
      .subscribe((triggerData) => {
        expect(triggerData).toBe(EVENT_TRIGGER);
      });

    expect(casesService.getEventTrigger).not.toHaveBeenCalled();
    expect(createCaseFieldsResolver.cachedEventTrigger).toBe(EVENT_TRIGGER);
  });

  it('should use draftId when resuming create event ', () => {
    route.queryParamMap.get.and.callFake((key) => {
      switch (key) {
        case QUERY_PARAM_IGNORE_WARNINGS:
          return IGNORE_WARNINGS;
        case DRAFT_QUERY_PARAM:
          return DRAFT_ID;
      }
    });
    casesService.getEventTrigger.and.returnValue(EVENT_TRIGGER_OBS);

    createCaseFieldsResolver
      .resolve(route)
      .subscribe((triggerData) => {
        expect(triggerData).toBe(EVENT_TRIGGER);
      });

    expect(casesService.getEventTrigger).toHaveBeenCalledWith(CASE_TYPE, EVENT_TRIGGER_ID, DRAFT_ID, String(IGNORE_WARNINGS));
    expect(route.paramMap.get).toHaveBeenCalledWith(PARAM_CASE_TYPE_ID);
    expect(route.paramMap.get).toHaveBeenCalledWith(PARAM_EVENT_ID);
    expect(route.queryParamMap.get).toHaveBeenCalledWith(QUERY_PARAM_IGNORE_WARNINGS);
    expect(route.paramMap.get).toHaveBeenCalledTimes(2);
    expect(route.queryParamMap.get).toHaveBeenCalledTimes(2);
  });

  it('should create error alert when event trigger cannot be retrieved', async () => {
    casesService.getEventTrigger.and.returnValue(throwError(ERROR));

    createCaseFieldsResolver
      .resolve(route)
      .subscribe((data) => {
        fail(data);
      }, (err) => {
        expect(err).toBeTruthy();
      });
  });
});
