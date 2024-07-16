import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import { HiddenConverter } from './hidden.converter';

export class ListedHearingViewerHiddenConverter implements HiddenConverter {
  public userRoles$: Observable<string[]>;

  constructor(private readonly store: Store<fromRoot.State>) {}

  public transformHidden(): Observable<boolean> {
    return this.store.pipe(select(fromRoot.getUserDetails)).pipe(
      map((userDetails) => userDetails?.userInfo?.roles.includes('listed-hearing-viewer')));
  }
}
