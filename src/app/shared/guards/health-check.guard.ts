import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../store';
import { HealthCheckService } from '../services/health-check.service';

@Injectable()
export class HealthCheckGuard {
  constructor(
        private readonly healthCheck: HealthCheckService,
        private readonly store: Store<fromRoot.State>,
  ) {}

  public canActivate() {
    return this.checkHealth().pipe(
      switchMap((res: any) => {
        const state = res.healthState;
        if (!state) {
          this.redirectToServiceDownPage();
        }
        return of(res.healthState);
      }),
      catchError(() => {
        this.redirectToServiceDownPage();
        return of(false);
      })
    );
  }

  public checkHealth(): Observable<boolean> {
    return this.healthCheck.doHealthCheck();
  }

  public redirectToServiceDownPage() {
    this.store.dispatch(new fromRoot.Go({ path: ['/service-down'] }));
  }
}

