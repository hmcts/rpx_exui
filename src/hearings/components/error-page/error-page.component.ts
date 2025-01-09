import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromHearingStore from '../../store';

@Component({
  selector: 'exui-hearings-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {
  public caseId: string;
  public sub: Subscription;

  constructor(private readonly hearingStore: Store<fromHearingStore.State>) {}

  public ngOnInit(): void {
    this.sub = this.hearingStore.select(fromHearingStore.getHearingsFeatureState).subscribe(
      (state) => {
        this.caseId = state.hearingList?.hearingListMainModel?.caseRef;
      }
    );
    // Reset errors
    this.hearingStore.dispatch(new fromHearingStore.ResetHearingValuesLastError());
    this.hearingStore.dispatch(new fromHearingStore.ResetHearingRequestLastError());
    this.hearingStore.dispatch(new fromHearingStore.ResetHearingActualsLastError());
  }

  public ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
