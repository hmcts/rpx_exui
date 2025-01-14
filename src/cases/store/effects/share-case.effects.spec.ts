import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { CaseShareService } from '../../../app/services/case/share-case.service';
import {
  AddShareCaseGo,
  AddShareCases,
  AssignUsersToCase,
  AssignUsersToCaseSuccess,
  LoadShareCase,
  LoadShareCaseSuccess,
  LoadUserFromOrgForCase,
  LoadUserFromOrgForCaseSuccess
} from '../actions';
import * as fromShareCaseEffects from './share-case.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Share Case Effects', () => {
  let actions$;
  let effects: fromShareCaseEffects.ShareCaseEffects;
  let store;
  const routerMock = jasmine.createSpyObj('Router', [
    'navigate'
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spyOnDispatchToStore = jasmine.createSpy();
  const caseShareServiceMock = jasmine.createSpyObj('CaseShareService', ['getShareCases', 'getUsersFromOrg', 'assignUsersWithCases']);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({}),
        RouterTestingModule],
    providers: [
        {
            provide: CaseShareService,
            useValue: caseShareServiceMock
        },
        {
            provide: Router,
            useValue: routerMock
        },
        fromShareCaseEffects.ShareCaseEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    store = TestBed.inject(Store);
    spyOnDispatchToStore = spyOn(store, 'dispatch').and.callThrough();
    effects = TestBed.inject(fromShareCaseEffects.ShareCaseEffects);
  });

  describe('addShareCases$', () => {
    it('should add share case action', () => {
      const action = new AddShareCases({
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      const completion = new AddShareCaseGo({
        path: ['/cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.addShareCases$).toBeObservable(expected);
    });
  });

  describe('navigateToAddShareCase$', () => {
    it('should add share case go', () => {
      const payload = {
        path: ['/cases/case-share'],
        sharedCases: [
          { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
          { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }]
      };
      routerMock.navigate.and.returnValue(Promise.resolve(true));
      const action = new AddShareCaseGo(payload);
      actions$ = hot('-a', { a: action });
      effects.navigateToAddShareCase$.subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('loadShareCases$', () => {
    it('should load share case', () => {
      const requestPayload = [
        { caseId: '1', caseTitle: 'James123' },
        { caseId: '2', caseTitle: 'Steve321' }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.getShareCases.and.returnValue(of(returnPayload));
      const action = new LoadShareCase(requestPayload);
      const completion = new LoadShareCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadShareCases$).toBeObservable(expected);
    });
  });

  describe('loadOrgUsers$', () => {
    it('should load organisation users', () => {
      const returnPayload = [
        {
          idamId: 'U111111',
          firstName: 'James',
          lastName: 'Priest',
          email: 'james.priest@test.com'
        },
        {
          idamId: 'U222222',
          firstName: 'Shaun',
          lastName: 'Godard',
          email: 'shaun.godard@test.com'
        }];
      caseShareServiceMock.getUsersFromOrg.and.returnValue(of(returnPayload));
      const action = new LoadUserFromOrgForCase();
      const completion = new LoadUserFromOrgForCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadOrgUsers$).toBeObservable(expected);
    });
  });

  describe('assignUsersWithCases$', () => {
    it('should assign users with cases', () => {
      const requestPayload = [
        {
          caseId: '1', caseTitle: 'James123', caseTypeId: 'type1', sharedWith: [
            {
              idamId: 'U111111',
              firstName: 'James',
              lastName: 'Priest',
              email: 'james.priest@test.com'
            }]
        },
        {
          caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2', sharedWith: [
            {
              idamId: 'U222222',
              firstName: 'Shaun',
              lastName: 'Godard',
              email: 'shaun.godard@test.com'
            }]
        }];
      const returnPayload = [
        { caseId: '1', caseTitle: 'James123', caseTypeId: 'type1' },
        { caseId: '2', caseTitle: 'Steve321', caseTypeId: 'type2' }];
      caseShareServiceMock.assignUsersWithCases.and.returnValue(of(returnPayload));
      const action = new AssignUsersToCase(requestPayload);
      const completion = new AssignUsersToCaseSuccess(returnPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.assignUsersWithCases$).toBeObservable(expected);
    });
  });
});
