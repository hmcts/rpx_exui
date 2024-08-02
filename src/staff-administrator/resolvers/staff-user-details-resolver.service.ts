import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { StaffUser } from '../models/staff-user.model';
import { StaffDataAccessService } from '../services/staff-data-access/staff-data-access.service';
import { SetError, ResetStaffSelect } from '../store/actions/staff-select.action';

@Injectable({
  providedIn: 'root'
})
export class StaffUserDetailsResolverService {
  constructor(
    private staffDataAccessService: StaffDataAccessService,
    private store: Store
  ) {}

  public resolve(route?: ActivatedRouteSnapshot) {
    this.store.dispatch(new ResetStaffSelect());
    return this.staffDataAccessService.fetchSingleUserById(route.params.id).pipe(
      map((user) => StaffUser.from(user)),
      catchError((error) => {
        this.store.dispatch(new SetError(error.error));
        return of();
      })
    );
  }
}
