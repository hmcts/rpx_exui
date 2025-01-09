import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AnswersComponent } from '../../../components';
import {
  Actions,
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateRoleStateData,
  AllocateTo,
  DurationOfRole,
  RoleCategory
} from '../../../models';
import { AnswerLabelText } from '../../../models/enums';
import { ConfirmAllocation } from '../../../store/actions';
import { AllocateRoleCheckAnswersComponent } from './allocate-role-check-answers.component';

describe('AllocateRoleCheckAnswersComponent', () => {
  let component: AllocateRoleCheckAnswersComponent;
  let fixture: ComponentFixture<AllocateRoleCheckAnswersComponent>;
  let mockStore: any;
  const pipeSubject: Subject<any> = new Subject<any>();
  const ALLOCATE_ROLE_STATE_DATA: AllocateRoleStateData = {
    caseId: '1111111111111111',
    jurisdiction: 'IA',
    assignmentId: 'a123456',
    state: AllocateRoleState.CHOOSE_ALLOCATE_TO,
    typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
    allocateTo: AllocateTo.ALLOCATE_TO_ME,
    personToBeRemoved: {
      id: 'p111111',
      name: 'test1',
      domain: ''
    },
    person: {
      id: 'p222222',
      name: 'test2',
      domain: ''
    },
    durationOfRole: DurationOfRole.SEVEN_DAYS,
    action: Actions.Allocate,
    period: {
      startDate: new Date(),
      endDate: new Date()
    },
    roleCategory: RoleCategory.LEGAL_OPERATIONS
  };

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    mockStore.pipe.and.returnValue(pipeSubject);
    TestBed.configureTestingModule({
      declarations: [AnswersComponent, AllocateRoleCheckAnswersComponent],
      providers: [
        { provide: Store, useValue: mockStore }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AllocateRoleCheckAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the confirm exclusion action with an undefined payroll', () => {
    component.navigationHandler(AllocateRoleNavigationEvent.CONFIRM);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new ConfirmAllocation(undefined));
  });

  it('should throw an error if there is an invalid navigation action', () => {
    expect(() => {
      component.navigationHandler(AllocateRoleNavigationEvent.CONTINUE);
    }).toThrow(new Error('Invalid option'));
  });

  it('should set caption for case manager', () => {
    component.setAnswersFromAllocateRoleStateStore(ALLOCATE_ROLE_STATE_DATA);
    expect(component.caption).toBe('Allocate a Lead judge');
  });

  it('should set caption for lead judge', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' }
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    expect(component.caption).toBe('Allocate a Lead judge');
  });

  it('should set caption for lead judge', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      typeOfRole: { id: '', name: '' }
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    expect(component.caption).toBe('Allocate a legal operations role');
  });

  it('should set answer for allocate', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' }
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    expect(component.answers.length).toBe(3);
    expect(component.answers[0].label).toBe('Type of role');
    expect(component.answers[0].value).toBe('Lead judge');
    expect(component.answers[1].label).toBe('Who the role will be allocated to');
    expect(component.answers[1].value).toBe('Allocate to me');
    expect(component.answers[2].label).toBe('Duration of role');
    expect(component.answers[2].value).toBe('7 days');
  });

  it('should set answer for reallocate', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      action: Actions.Reallocate,
      allocateTo: AllocateTo.REALLOCATE_TO_ANOTHER_PERSON
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    const theAnswer = component.answers.find((answer) => answer.label === AnswerLabelText.WhoBeAllocatedTo);
    expect(theAnswer.value).toBe('Reallocate to another person');
  });

  it('should setPersonDetails if allocate to another person', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      personToBeRemoved: {
        id: 'p111111',
        name: 'test1',
        email: 'test1@test.com',
        domain: ''
      },
      person: {
        id: 'p222222',
        name: 'test2',
        email: 'test2@test.com',
        domain: ''
      },
      allocateTo: AllocateTo.ALLOCATE_TO_ANOTHER_PERSON
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    const person = component.answers.find((answer) => answer.label === AnswerLabelText.Person);
    expect(person.value).toBe('test2\ntest2@test.com');
  });

  it('should setPersonDetails if allocate to case manager', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      personToBeRemoved: {
        id: 'p111111',
        name: 'test1',
        email: 'test1@test.com',
        domain: ''
      },
      person: {
        id: 'p222222',
        name: 'test2',
        email: 'test2@test.com',
        domain: ''
      },
      allocateTo: null,
      typeOfRole: { id: 'case-manager', name: 'Case manager' }
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    const person = component.answers.find((answer) => answer.label === AnswerLabelText.Person);
    expect(person.value).toBe('test2\ntest2@test.com');
  });

  it('should set answer for duration of role indefinitely', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      durationOfRole: DurationOfRole.INDEFINITE,
      period: {
        startDate: new Date('2021-12-17T03:24:00'),
        endDate: new Date('2021-12-27T03:24:00')
      }
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    expect(component.answers.length).toBe(3);
    expect(component.answers[2].label).toBe('Duration of role');
    expect(component.answers[2].value).toBe('Indefinite');
  });

  it('should set answer for duration of role in another period', () => {
    const allocateRoleStateData: AllocateRoleStateData = {
      ...ALLOCATE_ROLE_STATE_DATA,
      durationOfRole: DurationOfRole.ANOTHER_PERIOD,
      period: {
        startDate: new Date('2021-12-17T03:24:00'),
        endDate: new Date('2021-12-27T03:24:00')
      }
    };
    component.setAnswersFromAllocateRoleStateStore(allocateRoleStateData);
    expect(component.answers.length).toBe(3);
    expect(component.answers[2].label).toBe('Duration of role');
    expect(component.answers[2].value).toBe('17 December 2021 to 27 December 2021');
  });
});
