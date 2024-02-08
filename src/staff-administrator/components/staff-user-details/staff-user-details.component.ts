import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupOptions } from '@hmcts/rpx-xui-common-lib';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { InfoMessage } from '../../../app/shared/enums/info-message';
import { InformationMessage } from '../../../app/shared/models';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import { InfoMessageType } from '../../../role-access/models/enums';
import { StaffUserIDAMStatus } from '../../models/staff-user-idam-status.enum';
import { StaffUser } from '../../models/staff-user.model';
import { StaffDataAccessService } from '../../services/staff-data-access/staff-data-access.service';

@Component({
  selector: 'exui-staff-user-details',
  templateUrl: './staff-user-details.component.html',
  styleUrls: ['./staff-user-details.component.scss']
})
export class StaffUserDetailsComponent {
  public userDetails: StaffUser;
  public showAction: boolean = false;
  public loading = false;
  public status: 'success' | 'warning';
  public title: string = '';
  public message: string = '';

  constructor(
    private route: ActivatedRoute,
    private readonly router: Router,
    private staffDataAccessService: StaffDataAccessService,
    private readonly messageService: InfoMessageCommService,
  ) {
    const userDetailsFromSnapshot = this.route.snapshot.data.staffUserDetails;

    if (!userDetailsFromSnapshot) {
      this.router.navigateByUrl('/staff');
    } else {
      this.userDetails = StaffUser.from(userDetailsFromSnapshot);
    }
  }

  public updateUserStatus(): void {
    if (!this.loading) {
      this.loading = true;
      const staffUser = new StaffUser();
      Object.assign(staffUser, this.userDetails);
      staffUser.suspended = !staffUser.suspended;
      this.staffDataAccessService.updateUser(staffUser).pipe(
        switchMap(() => this.staffDataAccessService.fetchSingleUserById(this.userDetails.case_worker_id).pipe(
          finalize(() => {
            this.loading = false;
            window.scrollTo(0, 0);
          })
        )),
        tap((user) => this.userDetails = StaffUser.from(user)))
        .subscribe(
          () => {
            if (this.userDetails.up_idam_status !== StaffUserIDAMStatus.PENDING) {
              this.status = InfoMessageType.SUCCESS;
              // User either restored or suspended if successful
              this.title = this.userDetails.suspended ? 'User suspended' : 'User restored';
              this.message = this.userDetails.suspended ? InfoMessage.SUSPEND_USER_SUCCESS : InfoMessage.USER_RESTORED;
            }
          },
          (err) => {
            this.setErrorSteps(err);
          }
        );
    }
  }

  private setErrorSteps(err: HttpErrorResponse): void {
    if (err.status === 401 || err.status.toString().startsWith('5')) {
      this.router.navigateByUrl('/service-down');
    } else {
      this.status = 'warning';
      this.message = InfoMessage.SUSPEND_USER_ERROR;
      this.loading = false;
      window.scrollTo(0, 0);
    }
  }

  public onUpdateUser() {
    const formValues = this.userDetails;
    this.router.navigateByUrl(`/staff/user-details/${this.route.snapshot.params.id}/update`,
      { state: { formValues } });
  }

  public onCopyUser() {
    const formValues = {
      ...this.userDetails,
      first_name: '',
      last_name: '',
      email_id: '',
      suspended: false,
      up_idam_status: StaffUserIDAMStatus.PENDING
    };
    this.router.navigateByUrl(`/staff/user-details/${this.route.snapshot.params.id}/copy`,
      { state: { formValues } });
  }

  public resendInvite(): void {
    if (!this.loading) {
      this.loading = true;
      const staffUser = new StaffUser();
      Object.assign(staffUser, this.userDetails);
      staffUser.is_resend_invite = true;
      this.staffDataAccessService.updateUser(staffUser).pipe(
        finalize(() => {
          this.loading = false;
          window.scrollTo(0, 0);
        })
      )
        .subscribe(() => {
          this.messageService.nextMessage({
            message: InfoMessage.ACTIVATION_EMAIL_SENT,
            type: InfoMessageType.SUCCESS
          } as InformationMessage);
        },
        (err) => {
          console.log(err);
          this.messageService.nextMessage({
            message: InfoMessage.ACTIVATION_EMAIL_ERROR,
            type: InfoMessageType.WARNING
          } as InformationMessage);
        });
    }
  }

  public getServiceNameFromSkillId(skillId: number) {
    const skillGroupOptions = this.route.snapshot.data.skills as GroupOptions[];
    const serviceCode = skillGroupOptions.find((group) => group.options.find((option) => {
      return Number(option.key) === skillId;
    }))?.group;

    return this.route.snapshot.data.services
      .find((service) => service.key === serviceCode)?.label;
  }
}
