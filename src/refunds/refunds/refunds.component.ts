import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../app/store';

@Component({
  selector: 'exui-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent implements OnInit {
  public refundsApiRoot = 'api/refund';
  public notificationsApiRoot = 'api/notification';
  public ccdCaseNumber = 0;
  public userEmail = '';
  public userRoles = [];
  public userDataLoaded = false;
  public apiRoot = '/payments';

  constructor(private readonly store: Store<fromRoot.State>) {}

  public ngOnInit() {
    // Update the store with the user details
    this.store.dispatch(new fromRoot.LoadUserDetails(true));
    const userDetails$ = this.store.pipe(select(fromRoot.getUserDetails));
    userDetails$.subscribe((details) => {
      this.userEmail = details.userInfo.email;
      this.userRoles = details?.userInfo?.roles;
      this.userDataLoaded = true;
    });
  }
}
