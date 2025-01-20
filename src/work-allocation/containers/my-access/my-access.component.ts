import { Component } from '@angular/core';
import { CasesService } from '@hmcts/ccd-case-ui-toolkit';
import { take } from 'rxjs/operators';
import { AppUtils } from '../../../app/app-utils';
import { UserInfo, UserRole } from '../../../app/models';
import { ConfigConstants, ListConstants, SortConstants } from '../../components/constants';
import { Case } from '../../models/cases';
import { FieldConfig } from '../../models/common';
import { SearchCaseRequest } from '../../models/dtos';
import { WorkCaseListWrapperComponent } from '../work-case-list-wrapper/work-case-list-wrapper.component';

@Component({
  selector: 'exui-my-access',
  templateUrl: 'my-access.component.html'
})
export class MyAccessComponent extends WorkCaseListWrapperComponent {
  public get emptyMessage(): string {
    return ListConstants.EmptyMessage.MyAccess;
  }

  public get sortSessionKey(): string {
    return SortConstants.Session.MyAccess;
  }

  public get view(): string {
    return ListConstants.View.MyAccess;
  }

  public get fields(): FieldConfig[] {
    return ConfigConstants.MyAccess;
  }

  public backUrl: string = 'work/my-work/my-access';

  public getSearchCaseRequestPagination(): SearchCaseRequest {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const id = userInfo.id ? userInfo.id : userInfo.uid;
      const userRole: UserRole = AppUtils.getUserRole(userInfo.roles);
      return {
        search_parameters: [
          { key: 'user', operator: 'IN', values: [id] }
        ],
        sorting_parameters: [this.getSortParameter()],
        search_by: userRole
      };
    }
  }

  public onItemClickHandler(item: Case) {
    if (item.isNew) {
      if (item.role.startsWith('challenged-access')) {
        CasesService.updateChallengedAccessRequestAttributes(this.httpClient, item.case_id, {
          isNew: false
        })
          .pipe(take(1))
          .subscribe(() => item.isNew = false);
      } else if (item.role.startsWith('specific-access') && item.startDate !== 'Pending') {
        CasesService.updateSpecificAccessRequestAttributes(this.httpClient, item.case_id, {
          isNew: false
        })
          .pipe(take(1))
          .subscribe(() => item.isNew = false);
      }
    }
  }
}
