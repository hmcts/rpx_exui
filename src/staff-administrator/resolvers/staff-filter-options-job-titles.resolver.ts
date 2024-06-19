import { Injectable } from '@angular/core';

import { StaffDataAccessService } from '../services/staff-data-access/staff-data-access.service';

@Injectable({
  providedIn: 'root'
})
export class StaffFilterOptionsJobTitlesResolver {
  constructor(private staffDataAccessService: StaffDataAccessService) {}

  public resolve() {
    return this.staffDataAccessService.getJobTitles();
  }
}
