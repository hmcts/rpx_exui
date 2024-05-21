import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class InitialisationSyncService {
  private init$ = new BehaviorSubject<boolean>(false);
  private isComplete = false;
  private subscriptions: Subscription[] = [];

  private observer = {
    complete: () => {
      this.isComplete = true;
      this.subscriptions.forEach((s) => s.unsubscribe());
      this.subscriptions = [];
    }
  };

  public constructor() {
    this.init$.subscribe(this.observer);
  }

  // Call this function when initialisation (in this case, LaunchDarkly initialisation) has completed
  public initialisationComplete(complete = true): void {
    console.log(`InitialisationSyncService: initialisationComplete: ${complete}`);
    this.init$.next(complete);
    this.init$.complete();
  }

  // Call this function to specify code to be run after initialisation has completed
  // calls the supplied callback when the initialisationComplete function has been called
  public waitForInitialisation(callback: (arg:boolean) => void): void {
    console.log('InitialiseSyncService: waitForInitialisation');
    // No need to wait if the initilisation has already completed
    if (!this.isComplete) {
      this.subscriptions.push(this.init$.subscribe(callback));
    } else {
      console.log('Initialisation complete before waitForInitialisation called, calling callback directly');
      callback(true);
    }
  }

  public getSubscriptionCount() {
    return this.subscriptions.length;
  }
}
