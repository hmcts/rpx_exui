import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { HearingConditions } from '../models/hearingConditions';
import { ConditionOperator } from '../models/hearings.enum';
import { ScreenNavigationModel } from '../models/screenNavigation.model';
import * as fromHearingStore from '../store';
import { AbstractPageFlow } from './abstract-page-flow';

@Injectable()
export class PageFlow implements AbstractPageFlow {
  public hearingConditions$: Observable<HearingConditions>;
  constructor(private readonly hearingStore: Store<fromHearingStore.State>,
              private readonly router: Router) {
    this.hearingConditions$ = this.hearingStore.pipe(select(fromHearingStore.getHearingConditions));
  }

  public getCurrentPage(): string {
    const urlPaths: string[] = this.router.url.split('/');
    let lastPath = urlPaths[urlPaths.length - 1];
    if (lastPath.indexOf('#') > -1) {
      lastPath = lastPath.substring(0, lastPath.indexOf('#'));
    }
    return lastPath;
  }

  public getNextPage(screensNavigations$: Observable<ScreenNavigationModel[]>): string {
    const currentPage = this.getCurrentPage();
    let nextPage = '';
    combineLatest([this.hearingConditions$, screensNavigations$]).pipe(take(1))
      .subscribe(([hearingConditions, screenNavigationModels]: [HearingConditions, ScreenNavigationModel[]]) => {
        const screenModel = screenNavigationModels.find((screenNavigationModel) =>
          screenNavigationModel.screenName === currentPage);
        if (screenModel) {
          if (!screenModel.conditionKey) {
            nextPage = screenModel.navigation[0].resultValue;
          } else {
            if (hearingConditions.hasOwnProperty(screenModel.conditionKey)) {
              const conditionValue = hearingConditions[screenModel.conditionKey];
              screenModel.navigation.forEach((navigationModel) => {
                switch (navigationModel.conditionOperator) {
                  case ConditionOperator.INCLUDE:
                    nextPage = conditionValue.includes(navigationModel.conditionValue) ? navigationModel.resultValue : nextPage;
                    break;
                  case ConditionOperator.NOT_INCLUDE:
                    nextPage = !conditionValue.includes(navigationModel.conditionValue) ? navigationModel.resultValue : nextPage;
                    break;
                  default:
                    nextPage = '';
                }
              });
            }
          }
        } else {
          throw new Error(`Current screen not found: ${currentPage}`);
        }
      });
    return nextPage;
  }

  public getLastPage(screensNavigations$: Observable<ScreenNavigationModel[]>): string {
    let lastPage = '';
    combineLatest([this.hearingConditions$, screensNavigations$]).pipe(take(1))
      .subscribe(([hearingConditions, screenNavigationModels]: [HearingConditions, ScreenNavigationModel[]]) => {
        const defaultScreen = screenNavigationModels.find((model) => !model.conditionKey
          && model.navigation[0].resultValue === this.getCurrentPage());
        lastPage = defaultScreen ? defaultScreen.screenName : '';
        if (Object.keys(hearingConditions) && Object.keys(hearingConditions).length > 0) {
          for (const navModel of screenNavigationModels) {
            if (navModel.conditionKey) {
              const conditionValue = hearingConditions[navModel.conditionKey];
              const navigation = navModel.navigation.find((nav) => nav.resultValue === this.getCurrentPage());
              if (navigation) {
                if (navigation.conditionOperator === ConditionOperator.INCLUDE) {
                  lastPage = conditionValue.includes(navigation.conditionValue) ? navModel.screenName : lastPage;
                  break;
                } else if (navigation.conditionOperator === ConditionOperator.NOT_INCLUDE) {
                  lastPage = !conditionValue.includes(navigation.conditionValue) ? navModel.screenName : lastPage;
                  break;
                }
              }
            } else {
              if (navModel.navigation[0].resultValue === this.getCurrentPage()) {
                lastPage = navModel.screenName;
              }
            }
          }
        } else {
          const screenModel = screenNavigationModels.find((screenNavigationModel) =>
            screenNavigationModel.navigation[0].resultValue === this.getCurrentPage());
          lastPage = screenModel ? screenModel.screenName : '';
        }
      });
    return lastPage;
  }
}
