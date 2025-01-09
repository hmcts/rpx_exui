import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import { StaffDataFilterService } from '../../components/staff-users/services/staff-data-filter/staff-data-filter.service';
import { selectStaffError } from '../../store/selectors/staff-select.selector';

@Component({
  selector: 'exui-staff-users',
  templateUrl: './staff-users.component.html',
  styleUrls: ['./staff-users.component.scss'],
  providers: [StaffDataFilterService]
})
export class StaffUsersComponent {
  public advancedSearchEnabled = false;
  public staffSelectError: boolean = false;
  public staffSelectErrors: { title: string, description: string } = null;
  public errorSubscription$: Observable<any>;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public staffDataFilterService: StaffDataFilterService,
    private infoMessageCommService: InfoMessageCommService,
    private store: Store
  ) {
    this.errorSubscription$ = this.store.pipe(select(selectStaffError));
    this.errorSubscription$.pipe(
      takeUntil(this.unsubscribe$),
      tap((error) => {
        this.staffSelectError = !!error;
        this.staffSelectErrors = error ? { title: 'Staff error', description: error?.errorDescription ? error?.errorDescription: 'An unknown error has occured' } : null;
      })
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public advancedSearchClicked(): void {
    this.advancedSearchEnabled = !this.advancedSearchEnabled;
    this.infoMessageCommService.removeAllMessages();
  }
}
