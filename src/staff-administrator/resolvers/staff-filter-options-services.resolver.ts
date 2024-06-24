import { Injectable } from '@angular/core';

import { RefDataService } from '@hmcts/rpx-xui-common-lib';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StaffFilterOptionsServicesResolver {
  constructor(private refDataService: RefDataService) { }

  public resolve() {
    return this.refDataService.services$.pipe(
      map((services) => services.map((service) => ({
        key: service.service_code,
        label: service.service_description
      }))
      )
    );
  }
}
