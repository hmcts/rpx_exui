import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HearingsService } from '../../../services/hearings.service';
import * as fromHearingStore from '../../../store';
import { HearingActualsSummaryBaseComponent } from '../hearing-actuals-summary-base/hearing-actuals-summary-base.component';
import { DatePipe } from '@hmcts/ccd-case-ui-toolkit';

@Component({
  selector: 'exui-hearing-actuals-edit-summary',
  templateUrl: './hearing-actuals-edit-summary.component.html',
  styleUrls: ['./hearing-actuals-edit-summary.component.scss'],
  providers: [DatePipe]
})
export class HearingActualsEditSummaryComponent extends HearingActualsSummaryBaseComponent {
  constructor(
    public readonly hearingStore: Store<fromHearingStore.State>,
    public readonly hearingsService: HearingsService,
    public readonly route: ActivatedRoute,
    public readonly router: Router,
    public readonly ccdDatePipe: DatePipe

  ) {
    super(hearingStore, hearingsService, route, router, ccdDatePipe);
    this.partyChannels = [...this.route.snapshot.data.partyChannels, ...this.route.snapshot.data.partySubChannels];
  }

  public hearingActualAddEditUrl(): string {
    return `/hearings/actuals/${this.hearingRequestID}/hearing-actual-add-edit-summary`;
  }

  public onSubmitHearingDetails(): void {
    this.hearingStore.dispatch(new fromHearingStore.SubmitHearingActuals(this.id));
  }
}
