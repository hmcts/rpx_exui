import { ActivityService } from '@hmcts/ccd-case-ui-toolkit';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { ActivityResolver } from './activity.resolver';

describe('ActivityResolver', () => {
  let featureToggleService: any;
  let activityService: any;
  let activityResolver: ActivityResolver;

  beforeEach(() => {
    activityService = {
      verifyUserIsAuthorizedCalls: 0,
      mode: ActivityService.MODES.polling, // Current default from toolkit.
      verifyUserIsAuthorized: (): void => {
        activityService.verifyUserIsAuthorizedCalls++;
      }
    };
    featureToggleService = jasmine.createSpyObj<FeatureToggleService>('featureToggleService', ['getValue']);
  });

  const instantiate = (mode: string): void => {
    featureToggleService.getValue.and.returnValue(of(mode));
    activityResolver = new ActivityResolver(activityService, featureToggleService);
  };

  describe('when activity tracking is toggled off', () => {
    beforeEach(() => {
      instantiate('off');
    });

    it('should not bother to verify the user and return false', () => {
      let result: boolean;
      activityResolver.resolve().subscribe((r) => result = r);
      expect(activityService.mode).toEqual(ActivityService.MODES.off);
      expect(activityService.verifyUserIsAuthorizedCalls).toEqual(0);
      expect(result).toBe(false);
    });
  });

  describe('when activity tracking is set to an unrecognised value', () => {
    beforeEach(() => {
      instantiate('unrecognised');
    });

    it('should not bother to verify the user and return false', () => {
      let result: boolean;
      activityResolver.resolve().subscribe((r) => result = r);
      expect(activityService.mode).toEqual(ActivityService.MODES.off);
      expect(activityService.verifyUserIsAuthorizedCalls).toEqual(0);
      expect(result).toBe(false);
    });
  });

  describe('when activity tracking is set to "polling"', () => {
    beforeEach(() => {
      instantiate('polling');
    });

    it('should verify if the user is authorised and return true', () => {
      let result: boolean;
      activityResolver.resolve().subscribe((r) => result = r);
      expect(activityService.verifyUserIsAuthorizedCalls).toEqual(1);
      expect(result).toBe(true);
    });

    it('should verify if the user is authorised and return true even when they are NOT authorised', () => {
      let result: boolean;
      activityResolver.resolve().subscribe((r) => result = r);
      expect(activityService.mode).toEqual(ActivityService.MODES.polling);
      expect(activityService.verifyUserIsAuthorizedCalls).toEqual(1);
      expect(result).toBe(true);
    });
  });

  describe('when activity tracking is set to "socket"', () => {
    beforeEach(() => {
      instantiate('socket');
    });

    it('should verify if the user is authorised and return true', () => {
      let result: boolean;
      activityResolver.resolve().subscribe((r) => result = r);
      expect(activityService.verifyUserIsAuthorizedCalls).toEqual(1);
      expect(result).toBe(true);
    });

    it('should verify if the user is authorised and return true even when they are NOT authorised', () => {
      let result: boolean;
      activityResolver.resolve().subscribe((r) => result = r);
      expect(activityService.mode).toEqual(ActivityService.MODES.socket);
      expect(activityService.verifyUserIsAuthorizedCalls).toEqual(1);
      expect(result).toBe(true);
    });
  });
});
