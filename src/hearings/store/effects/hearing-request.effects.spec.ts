import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpError } from '@hmcts/ccd-case-ui-toolkit';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../app/services/logger/logger.service';
import { Go } from '../../../app/store';
import { hearingRequestMainModel, initialState } from '../../../hearings/hearing.test.data';
import { Mode } from '../../../hearings/models/hearings.enum';
import { AbstractPageFlow } from '../../../hearings/utils/abstract-page-flow';
import { HearingsService } from '../../services/hearings.service';
import * as hearingRequestActions from '../actions/hearing-request.action';
import { HearingRequestEffects } from './hearing-request.effects';

describe('Hearing Request Effects', () => {
  let actions$;
  let store: any;
  let effects: HearingRequestEffects;
  const hearingsServiceMock = jasmine.createSpyObj('HearingsService', [
    'getAllHearings', 'loadHearingRequest', 'updateHearingRequest', 'submitHearingRequest'
  ]);
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockLocation = jasmine.createSpyObj('Location', ['back']);
  const pageflowMock = jasmine.createSpyObj('AbstractPageFlow', [
    'getCurrentPage', 'getLastPage', 'getNextPage'
  ]);
  const loggerServiceMock = jasmine.createSpyObj('loggerService', ['error']);
  const hearingConditions = {
    isInit: false,
    region: 'Wales'
  };
  beforeEach(() => {
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: HearingsService,
          useValue: hearingsServiceMock
        },
        {
          provide: AbstractPageFlow,
          useValue: pageflowMock
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: LoggerService,
          useValue: loggerServiceMock
        },
        {
          provide: Location,
          useValue: mockLocation
        },
        HearingRequestEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(HearingRequestEffects);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    mockRouter.navigate.calls.reset();
  });

  describe('continueNavigation$', () => {
    it('should navigate to next page if continue on CREATE mode', () => {
      effects.mode = Mode.CREATE;
      pageflowMock.getNextPage.and.returnValue('next');
      const action = new hearingRequestActions.UpdateHearingRequest(null, hearingConditions);
      actions$ = cold('-a', { a: action });
      const navigateAction = new hearingRequestActions.UpdateHearingRequest(null, hearingConditions);
      const expected = cold('-b', { b: navigateAction });
      expect(effects.continueNavigation$).toBeObservable(expected);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hearings', 'request', 'next']);
    });

    it('should navigate to create edit page if on CREATE_EDIT mode', () => {
      effects.mode = Mode.CREATE_EDIT;
      const action = new hearingRequestActions.UpdateHearingRequest(null, hearingConditions);
      actions$ = cold('-a', { a: action });
      const navigateAction = new hearingRequestActions.UpdateHearingRequest(null, hearingConditions);
      const expected = cold('-b', { b: navigateAction });
      expect(effects.continueNavigation$).toBeObservable(expected);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hearings', 'request', 'hearing-create-edit-summary'], { fragment: 'venue' });
    });

    it('should navigate to create edit page if on VIEW_EDIT mode', () => {
      effects.mode = Mode.VIEW_EDIT;
      const action = new hearingRequestActions.UpdateHearingRequest(null, hearingConditions);
      actions$ = cold('-a', { a: action });
      const navigateAction = new hearingRequestActions.UpdateHearingRequest(null, hearingConditions);
      const expected = cold('-b', { b: navigateAction });
      expect(effects.continueNavigation$).toBeObservable(expected);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hearings', 'request', 'hearing-view-edit-summary'], { fragment: 'venue' });
    });
  });

  describe('submitHearingReason$', () => {
    it('should submit hearing reason', () => {
      const action = new hearingRequestActions.ViewEditSubmitHearingReason(hearingRequestMainModel);
      actions$ = cold('-a', { a: action });
      const expectedAction = new hearingRequestActions.ViewEditSubmitHearingReason(hearingRequestMainModel);
      const expected = cold('-b', { b: expectedAction });
      expect(effects.submitHearingReason$).toBeObservable(expected);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hearings', 'request', 'hearing-change-reason']);
    });
  });

  describe('submitHearingRequest$', () => {
    it('should submit hearing request', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      hearingsServiceMock.submitHearingRequest.and.returnValue(of(hearingRequestMainModel));
      const action = new hearingRequestActions.SubmitHearingRequest(hearingRequestMainModel);
      actions$ = cold('-a', { a: action });
      const expected = cold('-b', { b: hearingRequestMainModel });
      expect(effects.submitHearingRequest$).toBeObservable(expected);
      expect(hearingsServiceMock.submitHearingRequest).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hearings', 'request', 'hearing-confirmation']);
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it('should error submitting hearing request', () => {
      const error: HttpError = {
        status: 403,
        error: null,
        message: 'Http failure response: 403 Forbidden',
        timestamp: '',
        exception: '',
        path: ''
      };
      const dispatchSpy = spyOn(store, 'dispatch');
      hearingsServiceMock.submitHearingRequest.and.returnValue(throwError(error));
      const action = new hearingRequestActions.SubmitHearingRequest(hearingRequestMainModel);
      actions$ = cold('-a', { a: action });
      const expected = cold('-b', { b: error });
      expect(effects.submitHearingRequest$).toBeObservable(expected);
      expect(hearingsServiceMock.submitHearingRequest).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(new hearingRequestActions.SubmitHearingRequestFailure(error));
    });
  });

  describe('ViewEditSubmitHearingRequest$', () => {
    it('should update hearing request', () => {
      hearingsServiceMock.updateHearingRequest.and.returnValue(of(hearingRequestMainModel));
      const action = new hearingRequestActions.ViewEditSubmitHearingRequest(hearingRequestMainModel);
      actions$ = cold('-a', { a: action });
      const expected = cold('-b', { b: hearingRequestMainModel });
      expect(effects.viewEditSubmitHearingRequest$).toBeObservable(expected);
      expect(hearingsServiceMock.updateHearingRequest).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hearings', 'request', 'hearing-confirmation']);
    });

    it('should error update hearing request failed', () => {
      const error: HttpError = {
        status: 403,
        error: null,
        message: 'Http failure response: 403 Forbidden',
        timestamp: '',
        exception: '',
        path: ''
      };
      const dispatchSpy = spyOn(store, 'dispatch');
      hearingsServiceMock.updateHearingRequest.and.returnValue(throwError(error));
      const action = new hearingRequestActions.ViewEditSubmitHearingRequest(hearingRequestMainModel);
      actions$ = cold('-a', { a: action });
      const expected = cold('-b', { b: error });
      expect(effects.viewEditSubmitHearingRequest$).toBeObservable(expected);
      expect(hearingsServiceMock.updateHearingRequest).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(new hearingRequestActions.UpdateHearingRequestFailure(error));
    });
  });

  describe('handleError', () => {
    it('should handle 500', () => {
      const action$ = HearingRequestEffects.handleError({
        status: 400,
        message: 'error'
      });
      action$.subscribe((action) => expect(action).toEqual(new Go({ path: ['/hearings/error'] })));
    });

    it('should handle 4xx related errors', () => {
      const action$ = HearingRequestEffects.handleError({
        status: 403,
        message: 'error'
      });
      action$.subscribe((action) => expect(action).toEqual(new Go({ path: ['/hearings/error'] })));
    });
  });
});
