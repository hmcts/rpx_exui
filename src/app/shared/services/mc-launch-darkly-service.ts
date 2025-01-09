import { inject,
  Inject,
  Injectable,
  InjectOptions,
  InjectionToken,
  Type } from '@angular/core';
import { LaunchDarklyService } from '@hmcts/rpx-xui-common-lib';

export const MCLAUNCHDARKLYKEY = new InjectionToken<string>('LAUNCHDARKLYKEY');
@Injectable({
  providedIn: 'root'
})
export class McLaunchDarklyService extends LaunchDarklyService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(@Inject(MCLAUNCHDARKLYKEY) key: string) {
    super();
    this.rootGuard(LaunchDarklyService);
  }

  private rootGuard(type: Type<any>) {
    const io: InjectOptions = { optional: true, skipSelf: true };
    const parent = inject(type, io);

    if (parent) {
      throw Error(`[${type}]: Creating multiple instances, but should be singleton.`);
    }
  }
}
