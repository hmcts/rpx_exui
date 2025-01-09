import { Component, OnInit } from '@angular/core';
import { ContactDetailsDataModel } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../app/app.constants';
import { UserDetails } from '../../../app/models/user-details.model';
import * as fromRoot from '../../store';

@Component({
  selector: 'exui-get-help',
  templateUrl: './get-help.component.html'
})
export class GetHelpComponent implements OnInit {
  public userDetails$: Observable<any>;
  public helpContactDetails: ContactDetailsDataModel[] = AppConstants.HELP_CONTACT_DETAILS;
  public caseManager = false;

  constructor(
      private readonly store: Store<fromRoot.State>,
  ) {}

  public ngOnInit() {
    this.userDetails$ = this.store.pipe(select(fromRoot.getUserDetails));
    this.userDetails$.subscribe((userDetail: UserDetails) => {
      if (userDetail && userDetail.userInfo) {
        this.caseManager = userDetail?.userInfo?.roles.includes('pui-case-manager');
      }
    });
  }

  /**
   * Is Case Manager
   *
   * Note that I'm not sure why userRoles is prefixed with j. This should
   * be removed by the Node service when supplying userRoles to the UI.
   *
   * But it would require a rework of the header as well.
   *
   * @param userRoles - 'j:["caseworker", "pui-case-manager"]'
   */
  public isCaseManager(userRoles: string): boolean {
    return userRoles && userRoles.indexOf('pui-case-manager') !== -1;
  }
}
