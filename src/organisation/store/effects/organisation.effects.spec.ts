import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { OrganisationEffects } from '.';
import { LoggerService } from '../../../app/services/logger/logger.service';
import { OrganisationService } from '../../services';
import { LoadOrganisation, LoadOrganisationFail, LoadOrganisationSuccess } from '../actions';
import * as fromOrganisationEffects from './organisation.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Organisation Effects', () => {
  let actions$;
  let effects: OrganisationEffects;
  let loggerService: LoggerService;

  const organisationServiceMock = jasmine.createSpyObj('OrganisationService', [
    'fetchOrganisation'
  ]);

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        {
            provide: OrganisationService,
            useValue: organisationServiceMock
        },
        {
            provide: LoggerService,
            useValue: mockedLoggerService
        },
        fromOrganisationEffects.OrganisationEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    effects = TestBed.inject(OrganisationEffects);
    loggerService = TestBed.inject(LoggerService);
  });

  describe('loadOrganisation$', () => {
    it('should return a collection from loadOrganisation$ - LoadOrganisationSuccess', () => {
      const payload = {
        account_number: 'someNumber',
        account_name: 'someName',
        credit_limit: 0,
        available_balance: 0,
        status: 'someStatus',
        effective_date: 'someDate'
      };
      organisationServiceMock.fetchOrganisation.and.returnValue(of(payload));
      const action = new LoadOrganisation();
      const completion = new LoadOrganisationSuccess(payload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadOrganisation$).toBeObservable(expected);
    });
  });

  describe('loadOrganisation$ error', () => {
    it('should return LoadOrganisationFail', () => {
      organisationServiceMock.fetchOrganisation.and.returnValue(throwError(new Error()));
      const action = new LoadOrganisation();
      const completion = new LoadOrganisationFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadOrganisation$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });
});
