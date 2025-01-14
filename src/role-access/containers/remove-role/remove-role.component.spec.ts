import { Location } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { Caseworker } from '../../../work-allocation/models/dtos';
import { CaseworkerDataService } from '../../../work-allocation/services';
import { AnswersComponent } from '../../components';
import { AllocateRoleStateData, CaseRole, RemoveAllocationNavigationEvent, Role, RoleCategory, TypeOfRole } from '../../models';
import { CaseRoleDetails } from '../../models';
import { AnswerLabelText, RemoveRoleText } from '../../models/enums/answer-text';
import { AllocateRoleService } from '../../services';
import { RemoveRoleComponent } from './remove-role.component';
import { LoggerService } from '../../../app/services/logger/logger.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  template: `
    <exui-remove-role></exui-remove-role>`
})
class WrapperComponent {
  @ViewChild(RemoveRoleComponent, { static: true }) public appComponentRef: RemoveRoleComponent;
}

const mockCaseworker: Caseworker = {
  idamId: '999999999',
  firstName: 'test',
  lastName: 'testing',
  email: 'test@test.com',
  location: null,
  roleCategory: RoleCategory.LEGAL_OPERATIONS
};

describe('RemoveRoleComponent', () => {
  let component: RemoveRoleComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  const routerMock = jasmine.createSpyObj('Router', [
    'navigateByUrl', 'navigate', 'getCurrentNavigation'
  ]);
  routerMock.navigate.and.returnValue(Promise.resolve(true));
  const locationMock = jasmine.createSpyObj('Location', [
    'back'
  ]);
  const mockCaseworkerDataService = jasmine.createSpyObj('caseworkerDataService', ['getAll']);
  const loggerServiceMock = jasmine.createSpyObj('loggerService', ['error']);
  const allworkUrl = 'work/all-work/cases';
  window.history.pushState({ backUrl: allworkUrl }, '', allworkUrl);

  class AllocateRoleMockService extends AllocateRoleService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public confirmAllocation(allocateRoleStateData: AllocateRoleStateData): Observable<any> {
      return of(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getCaseRoles(caseId: string, jurisdiction: string, caseType: string, assignmentId?: string): Observable<CaseRole[]> {
      return of([
        {
          added: Date.UTC(2021, 6, 1),
          id: '999999999',
          actorId: '999999999',
          name: 'Mr Test',
          notes: 'Test exclusion',
          roleName: TypeOfRole.CaseManager,
          roleCategory: RoleCategory.JUDICIAL,
          email: 'user@test.com'
        }
      ] as unknown as CaseRole[]);
    }

    public getValidRoles(): Observable<Role[]> {
      return of(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public removeAllocation(assigmentId: string): Observable<any> {
      return of(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getCaseRolesUserDetails(caseRoles: string[]): Observable<CaseRoleDetails[]> {
      const caseRoleDetail: CaseRoleDetails = {
        idam_id: '999999999',
        surname: '',
        email_id: 'user@test.com',
        full_name: 'Mr Test',
        known_as: '',
        sidam_id: '999999999'
      };
      return of([caseRoleDetail]);
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    declarations: [AnswersComponent, RemoveRoleComponent, WrapperComponent],
    imports: [RouterTestingModule],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        roles: [
                            {
                                name: 'test user name',
                                roleCategory: RoleCategory.LEGAL_OPERATIONS,
                                roleName: TypeOfRole.CaseManager,
                                location: '1234567',
                                start: '2021-07-13T00:29:10.656Z',
                                end: '2021-07-15T00:29:10.656Z',
                                id: '999999999',
                                actorId: '1234567',
                                actions: [],
                                email: 'user@test.com'
                            }
                        ]
                    },
                    queryParams: {
                        caseId: '123456789',
                        assignmentId: '999999999'
                    }
                },
                queryParamMap: of(convertToParamMap({
                    caseId: '123456789',
                    assignmentId: '999999999',
                    jurisdiction: 'IA',
                    caseType: 'Alsyum'
                }))
            }
        },
        {
            provide: Router,
            useValue: routerMock
        },
        {
            provide: Location,
            useValue: locationMock
        },
        {
            provide: AllocateRoleService,
            useClass: AllocateRoleMockService
        },
        {
            provide: CaseworkerDataService,
            useValue: mockCaseworkerDataService
        },
        {
            provide: LoggerService,
            useValue: loggerServiceMock
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    routerMock.getCurrentNavigation.and.returnValue({ extras: { state: { backUrl: allworkUrl } } });
    mockCaseworkerDataService.getAll.and.returnValue(of([mockCaseworker]));
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    component.assignmentId = '999999999';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    const captionElement = fixture.debugElement.nativeElement.querySelector('.govuk-caption-l');
    expect(captionElement.textContent).toBeFalsy();
    const headingElement = fixture.debugElement.nativeElement.querySelector('.govuk-heading-l');
    expect(headingElement.textContent).toContain(RemoveRoleText.heading);
    const hintElement = fixture.debugElement.nativeElement.querySelector('.govuk-hint');
    expect(hintElement.textContent).toContain(RemoveRoleText.hint);
  });

  it('should display the exclusion details', () => {
    const ELEMENT_0 = fixture.debugElement.nativeElement.querySelectorAll('.govuk-summary-list__key')[0];
    expect(ELEMENT_0.textContent).toContain(AnswerLabelText.TypeOfRole);
    const ELEMENT_0_VALUE = fixture.debugElement.nativeElement.querySelectorAll('.govuk-summary-list__value')[0];
    expect(ELEMENT_0_VALUE.textContent).toContain(TypeOfRole.CaseManager);
    const ELEMENT_1 = fixture.debugElement.nativeElement.querySelectorAll('.govuk-summary-list__key')[1];
    expect(ELEMENT_1.textContent).toContain(AnswerLabelText.Person);
    const ELEMENT_1_VALUE = fixture.debugElement.nativeElement.querySelectorAll('.govuk-summary-list__value')[1];
    expect(ELEMENT_1_VALUE.textContent).toContain('user@test.com');
  });

  it('should navigate correctly on click', () => {
    component.onNavEvent(RemoveAllocationNavigationEvent.CANCEL);
    expect(locationMock.back).toHaveBeenCalled();
    component.onNavEvent(RemoveAllocationNavigationEvent.REMOVE_ROLE_ALLOCATION);
    const message: any = { type: 'success', message: RemoveRoleText.infoMessage };
    const additionalState = { state: { showMessage: true, retainMessages: true, message, messageText: RemoveRoleText.infoMessage } };
    expect(routerMock.navigate).toHaveBeenCalledWith([allworkUrl], additionalState);
  });

  describe('showSpinner', () => {
    it('should default to false', () => {
      expect(component.showSpinner).toBeFalsy();
    });

    it('should be true when removal is confirmed', () => {
      component.onNavEvent(RemoveAllocationNavigationEvent.REMOVE_ROLE_ALLOCATION);
      expect(component.showSpinner).toBeTruthy();
    });

    it('should be false when exclusion navigation is not handled', () => {
      expect(() => component.onNavEvent(RemoveAllocationNavigationEvent.BACK)).toThrow();
      expect(component.showSpinner).toBeFalsy();
    });
  });

  describe('navigationHandler cancel', () => {
    it('on cancel event', () => {
      fixture.detectChanges();
      component.onNavEvent(RemoveAllocationNavigationEvent.CANCEL);
      expect(locationMock.back).toHaveBeenCalled();
    });

    afterEach(() => {
      fixture.destroy();
    });
  });
});
