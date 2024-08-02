import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ChooseRadioOptionComponent } from '../../../components';
import { CHOOSE_ALLOCATE_TO } from '../../../constants';
import {
  Actions,
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateRoleStateData,
  AllocateTo,
  DurationOfRole,
  RoleCategory
} from '../../../models';
import * as fromFeature from '../../../store';
import { ChooseAllocateToComponent } from './choose-allocate-to.component';

describe('ChooseAllocateToComponent', () => {
  const radioOptionControl: FormControl = new FormControl('');
  const formGroup: FormGroup = new FormGroup({ [CHOOSE_ALLOCATE_TO]: radioOptionControl });

  let component: ChooseAllocateToComponent;
  let fixture: ComponentFixture<ChooseAllocateToComponent>;
  let mockStore: any;
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

  beforeEach(waitForAsync(() => {
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ChooseRadioOptionComponent, ChooseAllocateToComponent],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: Store,
          useValue: mockStore
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAllocateToComponent);
    mockStore = TestBed.inject(Store);
    mockStore.pipe.and.returnValue(of(ALLOCATE_ROLE_STATE_DATA));
    component = fixture.componentInstance;
    component.formGroup = formGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data in ngOnInit', () => {
    component.ngOnInit();
    expect(component.typeOfRole).toEqual({ id: 'lead-judge', name: 'Lead judge' });
    expect(component.allocateTo).toBe('Allocate to me');
    expect(component.caption).toBe('Allocate a Lead judge');
  });

  it('should navigationHandler with error', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue(null);
    component.navigationHandler(navEvent);
    fixture.detectChanges();
    expect(component.radioOptionControl.errors).toBeTruthy();
  });

  it('should dispatchEvent', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.dispatchEvent(navEvent);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseAllocateToAndGo({
      allocateTo: AllocateTo.ALLOCATE_TO_ME,
      allocateRoleState: 3
    }));
  });

  afterEach(() => {
    component = null;
    fixture.destroy();
  });
});
