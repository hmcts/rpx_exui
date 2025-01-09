import { LaunchDarklyDefaultsConstants } from './launch-darkly-defaults.constants';
import { DeploymentEnvironmentEnum } from '../../enums/deployment-environment-enum';

describe('LaunchDarklyDefaultsConstants', () => {
  it('should return the production data for the prod environment', () => {
    const def = LaunchDarklyDefaultsConstants.getWaServiceConfig(DeploymentEnvironmentEnum.PROD);
    expect(def).toBe(LaunchDarklyDefaultsConstants.waServiceConfigProd);
  });

  it('should return the test data for the AAT environment', () => {
    const def = LaunchDarklyDefaultsConstants.getWaServiceConfig(DeploymentEnvironmentEnum.AAT);
    expect(def).toBe(LaunchDarklyDefaultsConstants.waServiceConfigTest);
  });
});
