import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { Caseworker } from '../../../work-allocation/models/dtos';
import { AnswersComponent } from '../../components/answers/answers.component';
import { ExclusionNavigationEvent, RoleCategory } from '../../models';
import { AnswerHeaderText, AnswerLabelText, ExclusionMessageText } from '../../models/enums';
import { RoleExclusionsService } from '../../services';
import { DeleteExclusionComponent } from './delete-exclusion.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  template: `
    <exui-delete-exclusion></exui-delete-exclusion>`
})
class WrapperComponent {
  @ViewChild(DeleteExclusionComponent, { static: true }) public appComponentRef: DeleteExclusionComponent;
}

const mockCaseworker: Caseworker = {
  idamId: '999999999',
  firstName: 'test',
  lastName: 'testing',
  email: 'test@test.com',
  location: null,
  roleCategory: RoleCategory.LEGAL_OPERATIONS
};

describe('DeleteExclusionComponent', () => {
  let component: DeleteExclusionComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  const routerMock = jasmine.createSpyObj('Router', [
    'navigateByUrl', 'navigate'
  ]);
  const mockCaseworkerDataService = jasmine.createSpyObj('caseworkerDataService', ['getAll']);
  const mockRoleExclusionService = jasmine.createSpyObj('roleExclusionService', ['getCurrentUserRoleExclusions', 'deleteExclusion']);
  const exampleCaseId = '1234';
  const exclusionId = '2';
  const goToCaseUrl = `cases/case-details/${exampleCaseId}/roles-and-access`;
  const jurisdiction = 'Jurisdiction';
  const caseType = 'caseType';
  const exclusion = { caseId: exampleCaseId, exclusionId, jurisdiction, caseType, name: 'Sample Name', type: 'test', userType: 'LEGAL_OPERATIONS' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    declarations: [AnswersComponent, DeleteExclusionComponent, WrapperComponent],
    imports: [],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        roleExclusions: [
                            {
                                added: Date.UTC(2021, 6, 1),
                                id: exclusionId,
                                name: 'Judge Rinder',
                                notes: 'Test exclusion',
                                actorId: '999999999'
                            }
                        ]
                    }
                },
                queryParamMap: of(convertToParamMap(exclusion))
            }
        },
        {
            provide: Router,
            useValue: routerMock
        },
        {
            provide: RoleExclusionsService,
            useValue: mockRoleExclusionService
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockCaseworkerDataService.getAll.and.returnValue(of([mockCaseworker]));
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    const captionElement = fixture.debugElement.nativeElement.querySelector('.govuk-caption-l');
    expect(captionElement.textContent).toContain(AnswerHeaderText.DeleteExclusion);
    const headingElement = fixture.debugElement.nativeElement.querySelector('.govuk-heading-l');
    expect(headingElement.textContent).toContain(AnswerHeaderText.CheckAnswers);
    const hintElement = fixture.debugElement.nativeElement.querySelector('.govuk-hint');
    expect(hintElement.textContent).toContain(AnswerHeaderText.CheckInformation);
  });

  it('should navigate correctly on click', () => {
    component.onNavEvent(ExclusionNavigationEvent.CANCEL);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(goToCaseUrl);
    mockRoleExclusionService.deleteExclusion.and.returnValue(of(200));
    component.onNavEvent(ExclusionNavigationEvent.DELETE_EXCLUSION);
    const additionalState = { state: { showMessage: true, messageText: ExclusionMessageText.Delete } };
    expect(routerMock.navigate).toHaveBeenCalledWith([goToCaseUrl], additionalState);
  });

  describe('showSpinner', () => {
    it('should default to false', () => {
      expect(component.showSpinner).toBeFalsy();
    });

    it('should be true when exclusion is confirmed', () => {
      mockRoleExclusionService.deleteExclusion.and.returnValue(of(200));
      component.onNavEvent(ExclusionNavigationEvent.DELETE_EXCLUSION);
      fixture.detectChanges();
      expect(component.showSpinner).toBeTruthy();
    });

    it('should be false when exclusion navigation is not handled', () => {
      expect(() => component.onNavEvent(ExclusionNavigationEvent.BACK)).toThrow();
      fixture.detectChanges();
      expect(component.showSpinner).toBeFalsy();
    });
  });

  it('populateAnswers', () => {
    const someExclusion = {
      actorId: null,
      id: '',
      type: '',
      name: 'some name',
      userType: null,
      notes: 'notes',
      added: new Date(2021, 12, 31),
      email: ''
    };
    component.populateAnswers(someExclusion);
    component.answers[0].label = AnswerLabelText.Person;
    component.answers[0].value = exclusion.name;
    component.answers[1].label = AnswerLabelText.DescribeExclusion;
    component.answers[1].value = someExclusion.notes;
    component.answers[2].label = AnswerLabelText.DateAdded;
    component.answers[2].value = new Date(someExclusion.added).toLocaleDateString('en-GB');
  });
});

describe('DeleteExclusionComponent with no name', () => {
  let component: DeleteExclusionComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  const routerMock = jasmine.createSpyObj('Router', [
    'navigateByUrl', 'navigate'
  ]);
  const mockCaseworkerDataService = jasmine.createSpyObj('caseworkerDataService', ['getAll']);
  const mockRoleExclusionService = jasmine.createSpyObj('roleExclusionService', ['getCurrentUserRoleExclusions', 'deleteExclusion']);
  const mockAllocateRoleService = jasmine.createSpyObj('allocateService', ['getCaseRolesUserDetails']);
  const exampleCaseId = '1234';
  const exclusionId = '2';
  const goToCaseUrl = `cases/case-details/${exampleCaseId}/roles-and-access`;
  const jurisdiction = 'Jurisdiction';
  const caseType = 'caseType';
  const exclusion = { id: exclusionId, notes: null, added: new Date('21-01-2022'), caseId: exampleCaseId, jurisdiction, caseType, name: 'Sample Name', type: 'test', userType: 'LEGAL_OPERATIONS' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    declarations: [AnswersComponent, DeleteExclusionComponent, WrapperComponent],
    imports: [],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        roleExclusions: [
                            {
                                added: Date.UTC(2021, 6, 1),
                                id: exclusionId,
                                name: null,
                                notes: 'Test exclusion',
                                actorId: '999999999'
                            }
                        ]
                    }
                },
                queryParamMap: of(convertToParamMap(exclusion))
            }
        },
        {
            provide: Router,
            useValue: routerMock
        },
        {
            provide: RoleExclusionsService,
            useValue: mockRoleExclusionService
        },
        {
            provide: mockAllocateRoleService,
            useValue: mockAllocateRoleService
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockCaseworkerDataService.getAll.and.returnValue(of([mockCaseworker]));
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    const captionElement = fixture.debugElement.nativeElement.querySelector('.govuk-caption-l');
    expect(captionElement.textContent).toContain(AnswerHeaderText.DeleteExclusion);
    const headingElement = fixture.debugElement.nativeElement.querySelector('.govuk-heading-l');
    expect(headingElement.textContent).toContain(AnswerHeaderText.CheckAnswers);
    const hintElement = fixture.debugElement.nativeElement.querySelector('.govuk-hint');
    expect(hintElement.textContent).toContain(AnswerHeaderText.CheckInformation);
  });

  it('should find and set exclusions', () => {
    const userDetails = {
      id: '1234',
      forename: 'foreName',
      surname: 'surName',
      email: 'email@email.com',
      active: true,
      roles: ['pui-case-manager']
    };
    component.exclusionId = exclusionId;
    mockAllocateRoleService.getCaseRolesUserDetails.and.returnValue(userDetails);
    component.findAndSetExclusion([exclusion]);
    expect(component.roleExclusion.name).toBe('Sample Name');
  });

  it('should navigate correctly on click', () => {
    component.onNavEvent(ExclusionNavigationEvent.CANCEL);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(goToCaseUrl);
    mockRoleExclusionService.deleteExclusion.and.returnValue(of(200));
    component.onNavEvent(ExclusionNavigationEvent.DELETE_EXCLUSION);
    const additionalState = { state: { showMessage: true, messageText: ExclusionMessageText.Delete } };
    expect(routerMock.navigate).toHaveBeenCalledWith([goToCaseUrl], additionalState);
  });

  it('populateAnswers', () => {
    const someExclusion = {
      actorId: null,
      id: '',
      type: '',
      name: null,
      userType: null,
      notes: 'notes',
      added: new Date(2021, 11, 31),
      email: ''
    };
    component.populateAnswers(someExclusion);
    expect(component.answers[0].value).toBe('Awaiting person details');
    expect(component.answers[1].value).toBe(someExclusion.notes);
    expect(component.answers[2].value).toBe('31 December 2021');
  });
});
