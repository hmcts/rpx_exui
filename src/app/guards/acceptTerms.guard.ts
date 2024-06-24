import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as fromApp from '../store';

@Injectable({
  providedIn: 'root'
})
export class AcceptTermsGuard {
  constructor(private readonly store: Store<fromApp.State>) {}

  public canActivate(): Observable<boolean> {
    try {
      const isTandCEnabled$ = this.store.pipe(select(fromApp.getIsTermsAndConditionsFeatureEnabled));
      return isTandCEnabled$.pipe(switchMap((enabled) => enabled ? this.enableTermsAndConditions() : of(true)));
    } catch (e) {
      return of(true);
    }
  }

  private enableTermsAndConditions(): Observable<boolean> {
    return of(false);
  }
}
