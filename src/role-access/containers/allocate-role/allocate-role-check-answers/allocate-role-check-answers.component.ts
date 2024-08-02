import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { $enum as EnumUtil } from 'ts-enum-util';
import { RoleCategory } from '../../../../booking/models';
import {
  Actions,
  AllocateRoleNavigation,
  AllocateRoleNavigationEvent,
  AllocateRoleState,
  AllocateRoleStateData,
  AllocateTo,
  Answer,
  DurationOfRole,
  TypeOfRole
} from '../../../models';
import { AnswerHeaderText, AnswerLabelText } from '../../../models/enums';
import { RoleCaptionText } from '../../../models/enums/allocation-text';
import * as fromFeature from '../../../store';

@Component({
  selector: 'exui-allocate-role-check-answers',
  templateUrl: './allocate-role-check-answers.component.html'
})
export class AllocateRoleCheckAnswersComponent implements OnInit, OnDestroy {
  @Input() public navEvent: AllocateRoleNavigation;

  public answers: Answer[] = [];
  public caption: string = '';
  public heading: AnswerHeaderText = AnswerHeaderText.CheckAnswers;
  public hint: AnswerHeaderText = AnswerHeaderText.CheckInformation;
  public storeSubscription: Subscription;
  private allocateRoleStateData: AllocateRoleStateData;
  public typeOfRole: string;
  public allocateTo: AllocateTo;

  constructor(private readonly store: Store<fromFeature.State>) {}

  public ngOnInit(): void {
    this.storeSubscription = this.store.pipe(select(fromFeature.getAllocateRoleState))
      .subscribe((allocateRole) => this.setAnswersFromAllocateRoleStateStore(allocateRole));
  }

  public navigationHandler(navEvent: AllocateRoleNavigationEvent) {
    switch (navEvent) {
      case AllocateRoleNavigationEvent.CONFIRM:
        this.store.dispatch(new fromFeature.ConfirmAllocation(this.allocateRoleStateData));
        break;
      default:
        throw new Error('Invalid option');
    }
  }

  public setAnswersFromAllocateRoleStateStore(allocateRoleStateData: AllocateRoleStateData): void {
    this.allocateRoleStateData = allocateRoleStateData;
    this.typeOfRole = allocateRoleStateData.typeOfRole ? allocateRoleStateData.typeOfRole.name : '';
    this.allocateTo = allocateRoleStateData.allocateTo;
    const roleCategory = allocateRoleStateData.roleCategory;
    const action = EnumUtil(Actions).getKeyOrDefault(allocateRoleStateData.action);
    if (this.typeOfRole === TypeOfRole.CaseManager) {
      this.caption = `${action} ${RoleCaptionText.ALegalOpsCaseManager}`;
    } else {
      if (this.typeOfRole) {
        this.caption = `${action} a ${this.typeOfRole}`;
      } else if (roleCategory === RoleCategory.ADMIN) {
        this.caption = `${action} an admin role`;
      } else {
        this.caption = roleCategory !== undefined ? `${action} a ${roleCategory.replace('_', ' ').toLowerCase()} role` : `${action} a role`;
      }
    }
    this.answers = [];
    if (allocateRoleStateData.action === Actions.Allocate) {
      this.answers.push({ label: AnswerLabelText.TypeOfRole, value: allocateRoleStateData.typeOfRole.name, action: AllocateRoleState.CHOOSE_ROLE });
      if (allocateRoleStateData.allocateTo) {
        this.answers.push({ label: AnswerLabelText.WhoBeAllocatedTo, value: allocateRoleStateData.allocateTo, action: AllocateRoleState.CHOOSE_ALLOCATE_TO });
      }
    }
    if (allocateRoleStateData.action === Actions.Reallocate) {
      this.heading = AnswerHeaderText.CheckChanges;
      if (allocateRoleStateData.allocateTo) {
        this.answers.push({ label: AnswerLabelText.WhoBeAllocatedTo, value: allocateRoleStateData.allocateTo, action: AllocateRoleState.CHOOSE_ALLOCATE_TO });
      }
    }
    this.setPersonDetails(allocateRoleStateData);
    this.setDurationOfRole(allocateRoleStateData);
  }

  public setPersonDetails(allocateRoleStateData: AllocateRoleStateData): void {
    let personDetails = '';
    if (allocateRoleStateData.person && allocateRoleStateData.person.email) {
      personDetails += `${allocateRoleStateData.person.name}\n${allocateRoleStateData.person.email}`;
    }
    if (allocateRoleStateData.allocateTo === AllocateTo.ALLOCATE_TO_ANOTHER_PERSON ||
      (allocateRoleStateData.allocateTo === null && allocateRoleStateData.typeOfRole.name === TypeOfRole.CaseManager) ||
      allocateRoleStateData.action === Actions.Reallocate) {
      this.answers.push({ label: AnswerLabelText.Person, value: personDetails, action: AllocateRoleState.SEARCH_PERSON });
    } else if (allocateRoleStateData.allocateTo === AllocateTo.ALLOCATE_TO_ME) {
      if (personDetails) {
        this.answers.push({ label: AnswerLabelText.Person, value: personDetails, action: AllocateRoleState.SEARCH_PERSON });
      }
    }
  }

  public setDurationOfRole(allocateRoleStateData: AllocateRoleStateData): void {
    let durationOfRole;
    const startDate = moment.parseZone(allocateRoleStateData.period.startDate).format('D MMMM YYYY');
    let endDate;
    if (allocateRoleStateData.durationOfRole === DurationOfRole.INDEFINITE) {
      durationOfRole = DurationOfRole.INDEFINITE;
    } else if (allocateRoleStateData.durationOfRole === DurationOfRole.SEVEN_DAYS) {
      durationOfRole = DurationOfRole.SEVEN_DAYS;
    } else {
      endDate = moment.parseZone(allocateRoleStateData.period.endDate).format('D MMMM YYYY');
      durationOfRole = `${startDate} to ${endDate}`;
    }
    this.answers.push({ label: AnswerLabelText.DurationOfRole, value: durationOfRole, action: AllocateRoleState.CHOOSE_DURATION });
  }

  public onNavigate(action) {
    this.store.dispatch(new fromFeature.AllocateRoleChangeNavigation(action));
  }

  public ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }
}
