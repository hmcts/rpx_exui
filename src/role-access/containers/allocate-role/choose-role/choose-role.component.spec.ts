import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ChooseRadioOptionComponent } from '../../../components';
import { CHOOSE_A_ROLE } from '../../../constants';
import {
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  RoleCategory
} from '../../../models';
import * as fromFeature from '../../../store';
import { ChooseRoleComponent } from './choose-role.component';

const firstRoleOptions = [{ optionId: 'lead-judge', optionValue: 'Lead judge' },
  { optionId: 'hearing-judge', optionValue: 'Hearing judge' }];

const personRoles = [
  { roleId: 'lead-judge', roleName: 'Lead judge', roleCategory: RoleCategory.JUDICIAL },
  { roleId: 'hearing-judge', roleName: 'Hearing judge', roleCategory: RoleCategory.JUDICIAL }];

describe('ChooseRoleComponent', () => {
  const radioOptionControl: FormControl = new FormControl('');
  const formGroup: FormGroup = new FormGroup({ [CHOOSE_A_ROLE]: radioOptionControl });

  let component: ChooseRoleComponent;
  let fixture: ComponentFixture<ChooseRoleComponent>;
  const mockStore = jasmine.createSpyObj('store', ['dispatch', 'pipe']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ChooseRadioOptionComponent, ChooseRoleComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                roleCategory: 'JUDICIAL'
              }
            }
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseRoleComponent);
    component = fixture.componentInstance;
    component.formGroup = formGroup;
    mockStore.pipe.and.returnValue(of(personRoles));
    fixture.detectChanges();
  });

  it('should correctly navigate on click of continue', () => {
    const navEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.dispatchEvent(navEvent);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should have correctly defined the roles', () => {
    expect(component.caption).toBe('Allocate a judicial role');
    expect(component.radioOptionControl).toBeDefined();
    expect(component.formGroup).toBeDefined();
    expect(component.optionsList).toEqual(firstRoleOptions);
  });

  it('should navigationHandler with error', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.navigationHandler(navEvent);
    expect(component.radioOptionControl.errors).toBeTruthy();
  });

  it('should navigationHandler with success', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    spyOn(component, 'dispatchEvent');
    component.navigationHandler(navEvent);
    expect(component.dispatchEvent).toHaveBeenCalledWith(navEvent);
  });

  it('should dispatchEvent for legal ops assign judicial role', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    component.dispatchEvent(navEvent);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseRoleAndGo({
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
      allocateRoleState: AllocateRoleState.CHOOSE_ALLOCATE_TO
    }));
  });

  it('should dispatchEvent for legal ops user assign legal ops', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    component.dispatchEvent(navEvent);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseRoleAndGo({
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
      allocateRoleState: AllocateRoleState.CHOOSE_ALLOCATE_TO
    }));
  });

  it('should dispatchEvent for judicial user assign judicial role', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    component.dispatchEvent(navEvent);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseRoleAndGo({
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
      allocateRoleState: AllocateRoleState.CHOOSE_ALLOCATE_TO
    }));
  });

  it('should dispatchEvent for CTSC user assign ctsc role', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    component.dispatchEvent(navEvent);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseRoleAndGo({
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
      allocateRoleState: AllocateRoleState.CHOOSE_ALLOCATE_TO
    }));
  });

  it('should dispatchEvent for CTSC user assign judicial role', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    component.dispatchEvent(navEvent);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseRoleAndGo({
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
      allocateRoleState: AllocateRoleState.CHOOSE_ALLOCATE_TO
    }));
  });

  it('should dispatchEvent for judicial user assign legal ops user', () => {
    const navEvent: AllocateRoleNavigationEvent = AllocateRoleNavigationEvent.CONTINUE;
    component.radioOptionControl.setValue('Lead judge');
    component.dispatchEvent(navEvent);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromFeature.ChooseRoleAndGo({
      typeOfRole: { id: 'lead-judge', name: 'Lead judge' },
      allocateRoleState: AllocateRoleState.CHOOSE_ALLOCATE_TO
    }));
  });

  afterEach(() => {
    component = null;
    fixture.destroy();
  });
});
