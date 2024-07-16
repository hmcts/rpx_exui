import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcceptTermsGuard } from './acceptTerms.guard';

@Injectable({
  providedIn: 'root'
})
export class AllowAcceptTermsGuard {
  constructor(private readonly acceptGuard: AcceptTermsGuard) {}

  public canActivate(): Observable<boolean> {
    return this.acceptGuard.canActivate().pipe(
      map((accepted) => !accepted)
    );
  }
}
