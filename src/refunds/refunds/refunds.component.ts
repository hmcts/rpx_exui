import { Component, OnInit } from '@angular/core';
import { UserService } from '../../app/services/user/user.service';

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

  constructor(private readonly userService: UserService) {}

  public ngOnInit() {
    this.userService.getUserDetails().subscribe((details) => {
      this.userEmail = details.userInfo.email;
      this.userRoles = details?.userInfo?.roles;
      this.userDataLoaded = true;
    });
  }
}
