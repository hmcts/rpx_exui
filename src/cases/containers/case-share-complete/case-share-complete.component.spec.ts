import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromCasesFeature from '../../store';
import { CaseShareCompleteComponent } from './case-share-complete.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('CaseShareCompleteComponent', () => {
  let component: CaseShareCompleteComponent;
  let fixture: ComponentFixture<CaseShareCompleteComponent>;
  const SHARED_CASE = [{
    caseId: '9417373995765133',
    caseTitle: 'Sam Green Vs Williams Lee',
    sharedWith: [
      {
        idamId: 'u666666',
        firstName: 'Kate',
        lastName: 'Grant',
        email: 'kate.grant@lambbrooks.com'
      }]
  }];
  let mockStore: any;
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);
  beforeEach(waitForAsync(() => {
    mockStore = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    mockStore.pipe.and.returnValue(of(SHARED_CASE));

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaseShareCompleteComponent, RpxTranslateMockPipe],
      imports: [RouterTestingModule],
      providers: [
        LoadingService,
        { provide: Store, useValue: mockStore },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService },
        { provide: Store, useValue: mockStore },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CaseShareCompleteComponent);
    component = fixture.componentInstance;
    mockStore.pipe.and.returnValue(of(SHARED_CASE));
    fixture.detectChanges();
    mockFeatureToggleService.getValue.and.returnValue(of(true));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if pending', () => {
    const sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }],
      pendingUnshares: [
        {
          idamId: 'u777777',
          firstName: 'Nick',
          lastName: 'Rodrigues',
          email: 'nick.rodrigues@lambbrooks.com'
        }]
    }];
    component.isLoading = true;
    const returnValue = component.checkIfIncomplete(sharedCases);
    expect(returnValue).toEqual('PENDING');
  });

  it('should check if complete', () => {
    const sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    }];
    component.isLoading = true;
    const returnValue = component.checkIfIncomplete(sharedCases);
    expect(returnValue).toEqual('COMPLETE');
  });

  it('should user access block', () => {
    const case1 = {
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    };
    const case2 = {
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      pendingShares: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    };
    const case3 = {
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      pendingUnshares: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    };
    expect(component.showUserAccessBlock(case1)).toBeFalsy();
    expect(component.showUserAccessBlock(case2)).toBeTruthy();
    expect(component.showUserAccessBlock(case3)).toBeTruthy();
  });

  it('should tidy up shared case if complete', () => {
    component.completeScreenMode = 'COMPLETE';
    component.ngOnDestroy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromCasesFeature.ResetCaseSelection());
  });

  it('should see add user info only from case if remove user feature is toggled off', () => {
    component.completeScreenMode = 'PENDING';
    component.removeUserFromCaseToggleOn$ = of(false);
    fixture.detectChanges();
    const removeUserError = fixture.debugElement.nativeElement.querySelector('#add-user-error');
    expect(removeUserError).toBeTruthy();
    const addAndRemoveUserError = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-error');
    expect(addAndRemoveUserError).toBeFalsy();
    const removeUserInfo = fixture.debugElement.nativeElement.querySelector('#add-user-info');
    expect(removeUserInfo).toBeTruthy();
    const addAndRemoveUserInfo = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-info');
    expect(addAndRemoveUserInfo).toBeFalsy();
  });

  it('should see add and remove user info from case if remove user feature is toggled on', () => {
    component.completeScreenMode = 'PENDING';
    component.removeUserFromCaseToggleOn$ = of(true);
    fixture.detectChanges();
    const removeUserError = fixture.debugElement.nativeElement.querySelector('#add-user-error');
    expect(removeUserError).toBeFalsy();
    const addAndRemoveUserError = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-error');
    expect(addAndRemoveUserError).toBeTruthy();
    const removeUserInfo = fixture.debugElement.nativeElement.querySelector('#add-user-info');
    expect(removeUserInfo).toBeFalsy();
    const addAndRemoveUserInfo = fixture.debugElement.nativeElement.querySelector('#add-and-remove-user-info');
    expect(addAndRemoveUserInfo).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
