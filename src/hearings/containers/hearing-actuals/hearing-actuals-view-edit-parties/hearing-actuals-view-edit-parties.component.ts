import { Component, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import {
  ActualDayPartyModel,
  ActualHearingDayModel,
  HearingActualsMainModel,
  PlannedDayPartyModel
} from '../../../models/hearingActualsMainModel';
import { HearingActualsStateData } from '../../../models/hearingActualsStateData.model';
import { HearingChannelEnum } from '../../../models/hearings.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import * as fromHearingStore from '../../../store';
import { ActualHearingsUtils } from '../../../utils/actual-hearings.utils';
import { ValidatorsUtils } from '../../../utils/validators.utils';

@Component({
  selector: 'exui-hearing-actuals-view-edit-parties',
  styleUrls: ['./hearing-actuals-view-edit-parties.component.scss'],
  templateUrl: './hearing-actuals-view-edit-parties.component.html'
})
export class HearingActualsViewEditPartiesComponent implements OnInit, OnDestroy {
  public partyChannels: LovRefDataModel[];
  public hearingRoles: LovRefDataModel[] = [];
  public mutablePartyRoles: LovRefDataModel[] = [];

  public columns: string[] = [
    'First name',
    'Last name',
    'Role',
    'Attendance type',
    'Organisation (optional)',
    'Attendee representing',
    'Action'
  ];

  public form: FormGroup;
  public participants: any[] = [];
  public hearingActualsMainModel: HearingActualsMainModel;
  public caseTitle: string;
  public id: string;
  private hearingDate: string;
  public submitted: boolean;
  public errors: any[] = [];
  private sub: Subscription;
  private formSub: Subscription;
  public window: any = window;
  public showSpinner$: Observable<boolean>;
  private plannedDayIndex: number;
  public showSpinner: boolean = true;

  public constructor(private readonly fb: FormBuilder,
    private readonly validators: ValidatorsUtils,
    private readonly hearingStore: Store<fromHearingStore.State>,
    private readonly route: ActivatedRoute,
    private readonly renderer: Renderer2,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      parties: this.fb.array([], [Validators.maxLength(50)])
    });
  }

  public get parties(): FormArray {
    return this.form.get('parties') as FormArray;
  }

  private static toActualParties(parties: { parties: PlannedDayPartyModel[] }): ActualDayPartyModel[] {
    return parties
      .parties
      .map((party: any) => ({
        individualDetails: {
          firstName: party.firstName,
          lastName: party.lastName
        },
        actualOrganisationName: party.organisation,
        actualPartyId: party.partyId,
        didNotAttendFlag: false,
        partyChannelSubType: party.attendanceType,
        partyRole: party.role,
        representedParty: party.attendeeRepresenting
      }));
  }

  private static displayMultipleErrors(errors: { [p: string]: string }) {
    const keys = Object.keys(errors);
    return keys
      .map((key: string) => errors[key])
      .map((error: string) => error.replace('Enter', ''))
      .reduce((acc: string, curr: string, index) => {
        const isLast = index === keys.length - 1;
        const isSecondLast = index === keys.length - 2;
        if (isLast) {
          return `${acc} and ${curr}.`;
        } else if (isSecondLast) {
          return `${acc} ${curr}`;
        }

        return `${acc} ${curr}, `;
      }, 'Enter ');
  }

  public isPlannedParty(actualDayParty: ActualDayPartyModel): boolean {
    return this.hearingActualsMainModel.hearingPlanned.plannedHearingDays[this.plannedDayIndex]
      .parties.some((plannedParty) => plannedParty.partyID === actualDayParty.actualPartyId);
  }

  public ngOnInit(): void {
    const partyChannels: LovRefDataModel[] = this.route.snapshot.data.partyChannels.filter((channel: LovRefDataModel) => channel.key !== HearingChannelEnum.ONPPR);
    // Get unique values to display in the dropdown
    // If a parent does not contain any child nodes then consider the parent
    const uniquePartyChannels: LovRefDataModel[] = [];
    partyChannels.forEach((channel) => {
      if (channel.child_nodes) {
        channel.child_nodes.forEach((childNode) => {
          if (!uniquePartyChannels.map((node) => node.key).includes(childNode.key)) {
            uniquePartyChannels.push(childNode);
          }
        });
      } else {
        uniquePartyChannels.push(channel);
      }
    });
    this.partyChannels = uniquePartyChannels;
    this.hearingRoles = this.route.snapshot.data.hearingRole;
    this.showSpinner$ = this.loadingService.isLoading as any;
    const loadingToken = this.loadingService.register();
    this.sub = combineLatest([this.hearingStore.select(fromHearingStore.getHearingActuals), this.route.paramMap])
      .pipe(
        filter(([state]: [HearingActualsStateData, ParamMap]) => !!state.hearingActualsMainModel),
        first()
      )
      .subscribe(([state, params]: [HearingActualsStateData, ParamMap]) => {
        this.id = params.get('id');
        this.hearingDate = params.get('hearingDate');
        this.hearingActualsMainModel = JSON.parse(JSON.stringify(state.hearingActualsMainModel));
        this.caseTitle = this.hearingActualsMainModel.caseDetails.hmctsInternalCaseName;

        this.plannedDayIndex = this.hearingActualsMainModel.hearingPlanned.plannedHearingDays
          .findIndex((item) => ActualHearingsUtils.getDate(item.plannedStartTime) === this.hearingDate);
        this.setUpRoleLists();
        this.createForm(this.hearingActualsMainModel);
        this.subscribeToFormChanges();
        this.loadingService.unregister(loadingToken);
      }, () => {
        this.loadingService.unregister(loadingToken);
      });
  }

  private setUpRoleLists(): void {
    for (const role of this.hearingRoles) {
      this.mutablePartyRoles.push(role);
    }
  }

  private createForm(hearingActualsMainModel: HearingActualsMainModel): void {
    const actualDayIndex = ActualHearingsUtils.getActualDayIndexFromHearingDate(hearingActualsMainModel, this.hearingDate);

    const hasActualParties = hearingActualsMainModel?.hearingActuals?.actualHearingDays?.length
      ? hearingActualsMainModel.hearingActuals.actualHearingDays[actualDayIndex]?.actualDayParties?.length > 0
      : false;

    if (hasActualParties) {
      hearingActualsMainModel.hearingActuals.actualHearingDays[actualDayIndex].actualDayParties.forEach((party: ActualDayPartyModel) => {
        this.addActualParticipantsAndParties(party);
      });
    } else {
      hearingActualsMainModel.hearingPlanned.plannedHearingDays[this.plannedDayIndex].parties.forEach((party: PlannedDayPartyModel) => {
        this.addPlannedParty(party);
      });
    }
  }

  private addActualParticipantsAndParties(actualParty: ActualDayPartyModel) {
    if (actualParty?.individualDetails) {
      if (this.isPlannedParty(actualParty)) {
        this.participants.push({
          name: `${actualParty.individualDetails.firstName} ${actualParty.individualDetails.lastName}`,
          id: actualParty.actualPartyId
        });
      }
      this.parties.push(this.fb.group({
        firstName: [actualParty.individualDetails.firstName, [this.validators.mandatory('Enter first name')]],
        lastName: [actualParty.individualDetails.lastName, this.isPlannedParty(actualParty) ? [] : [this.validators.mandatory('Enter last name')]],
        role: [actualParty.partyRole, this.isPlannedParty(actualParty) ? [] : [this.validators.mandatory('Enter party role')]],
        attendanceType: [actualParty.partyChannelSubType, [this.validators.mandatory('Enter attendance type')]],
        organisation: [actualParty.actualOrganisationName],
        attendeeRepresenting: [actualParty.representedParty, this.isPlannedParty(actualParty) ? [] : [this.validators.mandatory('Enter attendee representing')]],
        partyId: [actualParty.actualPartyId],
        isPlannedParty: [this.isPlannedParty(actualParty)]
      }));
    }
  }

  private addPlannedParty(plannedParty: PlannedDayPartyModel) {
    if (plannedParty?.individualDetails) {
      if (plannedParty.partyID) {
        this.participants.push({
          name: `${plannedParty.individualDetails.firstName} ${plannedParty.individualDetails.lastName}`,
          id: plannedParty.partyID
        });
      }
      this.parties.push(this.fb.group({
        firstName: [plannedParty.individualDetails.firstName, null],
        lastName: [plannedParty.individualDetails.lastName, null],
        role: [plannedParty.partyRole, null],
        attendanceType: [plannedParty.partyChannelSubType, [this.validators.mandatory('Enter attendance type')]],
        organisation: [plannedParty.organisationDetails && plannedParty.organisationDetails.name],
        attendeeRepresenting: [null, null],
        partyId: [plannedParty.partyID],
        isPlannedParty: [true]
      }));
    }
  }

  public rowHasErrors(index: number): boolean {
    return this.parties.controls[index].invalid;
  }

  public displayRowErrors(index: number): string {
    const errors = this.getAllRowErrors((this.parties.controls[index] as FormGroup).controls);
    if (!errors) {
      return '';
    }
    const keys = Object.keys(errors);
    if (!keys.length) {
      return null;
    }
    if (keys.length === 1) {
      return errors[keys[0]];
    }
    return HearingActualsViewEditPartiesComponent.displayMultipleErrors(errors);
  }

  public highlightRowError(index: number, error: string): boolean {
    const controls = (this.parties.controls[index] as FormGroup).controls;
    return this.submitted && controls[error].invalid;
  }

  public addPartyForm(index: number): FormGroup {
    return this.fb.group({
      firstName: [null, [this.validators.mandatory('Enter first name')]],
      lastName: [null, [this.validators.mandatory('Enter last name')]],
      role: [null, [this.validators.mandatory('Enter party role')]],
      attendanceType: [null, [this.validators.mandatory('Enter attendance type')]],
      organisation: [null],
      attendeeRepresenting: [null, [this.validators.mandatory('Enter attendee representing')]],
      isPlannedParty: [false]
    }, { validator: this.validators.validateDuplicateEntries(index, 'Participant details already entered.') });
  }

  public addRow($event: Event): void {
    this.errors = [];
    $event.preventDefault();
    ($event.target as HTMLElement).blur();
    const index = this.parties.length;
    this.parties.push(this.addPartyForm(index));
    setTimeout(() => {
      this.renderer.selectRootElement('tr:last-child input').focus();
    }, 100);
  }

  public removeRow($event: Event, index: number): void {
    $event.preventDefault();
    this.errors = [];
    this.parties.removeAt(index);
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  public submitForm(parties: { parties: PlannedDayPartyModel[] }, valid: boolean): void {
    this.submitted = true;
    if (!valid) {
      this.displayErrors();
      return;
    }
    if (valid) {
      const actualDayParties = HearingActualsViewEditPartiesComponent.toActualParties(parties);
      const hearingActuals = ActualHearingsUtils.mergeSingleHearingPartActuals(
        this.hearingActualsMainModel, this.hearingDate, { actualDayParties } as ActualHearingDayModel
      );

      this.hearingStore.dispatch(new fromHearingStore.UpdateHearingActuals({
        hearingId: this.id,
        hearingActuals
      }));

      if (this.id) {
        this.ngZone.run(() => {
          this.router.navigate([`/hearings/actuals/${this.id}/hearing-actual-add-edit-summary`]);
        });
      }
    }
  }

  public getRole(value: string): string {
    const hearingRole = this.hearingRoles.find((role) => role.key === value);
    return hearingRole ? hearingRole.value_en : value;
  }

  private getAllRowErrors(controls: { [p: string]: AbstractControl }): { [p: string]: string } {
    const errors: { [p: string]: string } = {};
    Object.keys(controls).forEach((key) => {
      const controlErrors: ValidationErrors = controls[key].errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          errors[key] = controlErrors[keyError].message;
        });
      }
    });
    return errors;
  }

  private subscribeToFormChanges() {
    this.formSub = this.form.valueChanges.subscribe(() => {
      this.submitted = false;
    });
  }

  private displayErrors(): void {
    this.errors = this.parties.controls.reduce((acc, party, index: number) => {
      const message = this.displayRowErrors(index);
      if (!message) {
        return acc;
      }
      return [...acc, { id: `participant${index}`, message }];
    }, []);
  }
}
