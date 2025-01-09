import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Person, PersonRole } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { $enum as EnumUtil } from 'ts-enum-util';

import { PERSON_ERROR_MESSAGE } from '../../../constants';
import {
  Actions,
  AllocateRoleNavigation,
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateRoleStateData,
  AllocateTo,
  RoleCategory,
  SpecificRole
} from '../../../models';
import * as fromFeature from '../../../store';
import { getTitleText } from '../../../utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'exui-allocate-role-search-person',
  templateUrl: './allocate-role-search-person.component.html'
})
export class AllocateRoleSearchPersonComponent implements OnInit {
  public allocateAction = 'Allocate';
  public ERROR_MESSAGE = PERSON_ERROR_MESSAGE;
  @Input() public navEvent: AllocateRoleNavigation;
  @Input() public existingUsers: string[] = [];
  public domain = PersonRole.JUDICIAL;
  public title: string;
  public userIncluded: boolean = true;
  public boldTitle: string = 'Find the person';
  public formGroup: FormGroup = new FormGroup({});
  public personName: string;
  public person: Person;
  public userId: string;
  public appStoreSub: Subscription;
  public subscription: Subscription;
  public roleType: SpecificRole;
  public services: string;
  public assignedUser: string;

  constructor(private readonly store: Store<fromFeature.State>, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.subscription = this.store.pipe(select(fromFeature.getAllocateRoleState)).subscribe((allocateRoleStateData) => this.setData(allocateRoleStateData));
  }

  private setData(allocateRoleStateData: AllocateRoleStateData): void {
    const action = EnumUtil(Actions).getKeyOrDefault(allocateRoleStateData.action);
    if (allocateRoleStateData.roleCategory === RoleCategory.LEGAL_OPERATIONS) {
      this.domain = PersonRole.CASEWORKER;
    } else if (allocateRoleStateData.roleCategory === RoleCategory.ADMIN) {
      this.domain = PersonRole.ADMIN;
    } else if (allocateRoleStateData.roleCategory === RoleCategory.CTSC) {
      this.domain = PersonRole.CTSC;
    }
    this.title = getTitleText(allocateRoleStateData.typeOfRole, action, allocateRoleStateData.roleCategory);
    this.personName = allocateRoleStateData && allocateRoleStateData.person ? this.getDisplayName(allocateRoleStateData.person) : null;
    this.person = allocateRoleStateData.person;
    // hide user when allocate as user can select allocate to me
    this.userIncluded = !(allocateRoleStateData.action === Actions.Allocate);
    // Set assigned user from state data.
    this.assignedUser = allocateRoleStateData && allocateRoleStateData.personToBeRemoved && allocateRoleStateData.personToBeRemoved.id;

    // Add assigned user to existingUsers array if both are given
    if (this.existingUsers && this.existingUsers.length > 0 && this.assignedUser) {
      this.existingUsers.push(this.assignedUser);
    }

    this.roleType = allocateRoleStateData.typeOfRole;
    this.services = allocateRoleStateData.jurisdiction;
  }

  public navigationHandler(navEvent: AllocateRoleNavigationEvent): void {
    if (this.formGroup && this.formGroup.value && this.formGroup.value.findPersonControl && this.person) {
      switch (navEvent) {
        case AllocateRoleNavigationEvent.CONTINUE:
          const person = this.person;
          this.store.dispatch(new fromFeature.ChoosePersonAndGo({
            person,
            allocateRoleState: AllocateRoleState.CHOOSE_DURATION,
            allocateTo: AllocateTo.ALLOCATE_TO_ANOTHER_PERSON
          }));
          break;
        default:
          throw new Error('Invalid option');
      }
    } else {
      this.formGroup.setErrors({
        invalid: true
      });
      return;
    }
  }

  public selectedPerson(person: Person): void {
    this.person = person;
  }

  private getDisplayName(selectedPerson: Person): string {
    return selectedPerson.email ? `${selectedPerson.name}(${selectedPerson.email})` : selectedPerson.name;
  }
}
