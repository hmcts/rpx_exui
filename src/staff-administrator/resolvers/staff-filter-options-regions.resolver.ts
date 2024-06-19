import { Injectable } from '@angular/core';

import { RefDataService } from '@hmcts/rpx-xui-common-lib';

@Injectable({
  providedIn: 'root'
})
export class StaffFilterOptionsRegionsResolver {
  constructor(private refDataService: RefDataService) {}

  public resolve() {
    return this.refDataService.regions$;
  }
}
