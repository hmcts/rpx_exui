import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromHearingStore from '../store';
import * as actions from '../store/actions/hearing-actuals.action';

@Injectable({
  providedIn: 'root'
})
export class ActualSummaryResponseResolver {
  constructor(private readonly store: Store<fromHearingStore.State>) {}

  public resolve(route: ActivatedRouteSnapshot): void {
    return this.store.dispatch(new actions.GetHearingActuals(route.params.id));
  }
}
