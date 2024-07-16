import { DeploymentEnvironmentEnum } from '../../enums/deployment-environment-enum';

// Temporary solution to the problem that LaunchDarkly initialisation doesn't complete before we
// need to initialise ccd-case-ui-toolkit.
// The full fix is to resolve the race condition so that toolkit initialisation
// doesn't start until LD is fully initialised
export class LaunchDarklyDefaultsConstants {
  public static readonly waServiceConfigTest = {
    configurations: [
      {
        caseTypes: [
          'Asylum'
        ],
        releaseVersion: '4',
        serviceName: 'IA'
      },
      {
        caseTypes: [
          'PRIVATELAW',
          'PRLAPPS',
          'PRIVATELAW_ExceptionRecord'
        ],
        releaseVersion: '4',
        serviceName: 'PRIVATELAW'
      },
      {
        caseTypes: [
          'PUBLICLAW',
          'CARE_SUPERVISION_EPO'
        ],
        releaseVersion: '4',
        serviceName: 'PUBLICLAW'
      },
      {
        caseTypes: [
          'CIVIL',
          'GENERALAPPLICATION'
        ],
        releaseVersion: '4',
        serviceName: 'CIVIL'
      },
      {
        caseTypes: [
          'CriminalInjuriesCompensation'
        ],
        releaseVersion: '4',
        serviceName: 'ST_CIC'
      },
      {
        caseTypes: [
          'ET_EnglandWales',
          'ET_Scotland',
          'ET_EnglandWales_Multiple',
          'ET_Scotland_Multiple'
        ],
        releaseVersion: '4',
        serviceName: 'EMPLOYMENT'
      },
      {
        caseTypes: [
          'Benefit',
          'SSCS_ExceptionRecord'
        ],
        releaseVersion: '4',
        serviceName: 'SSCS'
      },
      {
        caseTypes: [
          'ST_CIC'
        ],
        releaseVersion: '4',
        serviceName: 'ST_CIC'
      }
    ]
  };

  public static readonly waServiceConfigProd = {
    configurations: [
      {
        caseTypes: [
          ''
        ],
        releaseVersion: '4',
        serviceName: ''
      },
      {
        caseTypes: [
          'Asylum'
        ],
        releaseVersion: '4',
        serviceName: 'IA'
      },
      {
        caseTypes: [
          'CIVIL',
          'GENERALAPPLICATION'
        ],
        releaseVersion: '4',
        serviceName: 'CIVIL'
      },
      {
        caseTypes: [
          'PRIVATELAW',
          'PRLAPPS'
        ],
        releaseVersion: '4',
        serviceName: 'PRIVATELAW'
      },
      {
        caseTypes: [
          'CriminalInjuriesCompensation'
        ],
        releaseVersion: '4',
        serviceName: 'ST_CIC'
      },
      {
        caseTypes: [
          'ET_EnglandWales',
          'ET_Scotland'
        ],
        releaseVersion: '4',
        serviceName: 'EMPLOYMENT'
      },
      {
        caseTypes: [
          'Benefit',
          'SSCS_ExceptionRecord'
        ],
        releaseVersion: '4',
        serviceName: 'SSCS'
      },
      {
        caseTypes: [
          'CARE_SUPERVISION_EPO'
        ],
        releaseVersion: '4',
        serviceName: 'PUBLICLAW'
      }
    ]
  };

  public static getWaServiceConfig(env: DeploymentEnvironmentEnum): object {
    if (env === DeploymentEnvironmentEnum.PROD) {
      return LaunchDarklyDefaultsConstants.waServiceConfigProd;
    }
    return LaunchDarklyDefaultsConstants.waServiceConfigTest;
  }
}
