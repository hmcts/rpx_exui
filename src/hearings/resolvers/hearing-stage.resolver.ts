import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../../app/services';
import { HearingCategory } from '../models/hearings.enum';
import { LovRefDataModel } from '../models/lovRefData.model';
import { LovRefDataService } from '../services/lov-ref-data.service';
import * as fromHearingStore from '../store';
import { RefDataResolver } from './ref-data-resolver.resolve';

@Injectable({
  providedIn: 'root'
})
export class HearingStageResolver extends RefDataResolver {
  constructor(
    protected readonly lovRefDataService: LovRefDataService,
    protected readonly hearingStore: Store<fromHearingStore.State>,
    protected readonly router: Router,
    protected readonly sessionStorageService: SessionStorageService
  ) {
    super(lovRefDataService, hearingStore, router, sessionStorageService);
  }

  public resolve(route?: ActivatedRouteSnapshot): Observable<LovRefDataModel[]> {
    route.data = {
      ...route.data,
      category: HearingCategory.HearingType
    };

    return super.resolve(route);
  }
}
