import { of } from 'rxjs';
import { RestrictedCaseAccessGuard } from './restricted-case-access-guard';

describe('Restricted case access guard', () => {
  let guard: RestrictedCaseAccessGuard;
  let featureToggleService: any;

  beforeEach(() => {
    featureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValueOnce']);
    guard = new RestrictedCaseAccessGuard(featureToggleService);
  });

  it('is Truthy', () => {
    expect(guard).toBeTruthy();
  });

  it('should guard return true', () => {
    featureToggleService.getValueOnce.and.returnValue(of(true));
    guard.canActivate().subscribe((result) => {
      expect(result).toEqual(true);
    });
  });

  it('should guard return false', () => {
    featureToggleService.getValueOnce.and.returnValue(of(false));
    guard.canActivate().subscribe((result) => {
      expect(result).toEqual(false);
    });
  });
});
