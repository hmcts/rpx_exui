import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert, AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'exui-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit, OnDestroy {
  public message = '';
  public level = '';
  public alertMessageSubscription: Subscription;

  private alertMessageObservable: Observable<Alert>;

  constructor(
    private readonly alertService: AlertService
  ) {}

  public ngOnInit() {
    this.alertMessageObservable = this.alertService.alerts.pipe(select((alert) => alert));
    this.alertMessageSubscription = this.alertMessageObservable.subscribe((alert) => {
      if (alert) {
        const msg = alert.message;
        this.level = alert.level;
        this.message = this.hyphenate(msg);
      } else {
        this.message = '';
      }
    });
  }

  public hyphenate(msg: string): string {
    const caseId = msg?.match(/\d{16}/g);
    if (caseId) {
      const caseIdHyphen = msg.match(/(\d\d\d\d)/g).join('-');
      return msg.replace(caseId.toString(), caseIdHyphen);
    }
    return msg;
  }

  public ngOnDestroy(): void {
    this.unSubscribe(this.alertMessageSubscription);
  }

  public unSubscribe(subscription: Subscription): void {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
