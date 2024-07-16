import { Injectable } from '@angular/core';

import { ActivityService } from '@hmcts/ccd-case-ui-toolkit';
import { Observable, of } from 'rxjs';

@Injectable()
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  public resolve(): Observable<boolean> {
    try {
      this.activityService.verifyUserIsAuthorized();
    } catch (err) {
      console.log(err);
    }
    return of(true);
  }
}
