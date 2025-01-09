import { baseConfig } from './base-config';
import { aatDifferences } from './aat-diffs';
import { previewDifferences } from './preview-diffs';

export function setupMenuConfig(environment) {
  let config;
  if (environment === 'prod') {
    config = baseConfig;
  } else if (environment === 'aat') {
    let aatConfig = { ...baseConfig };
    const rolesRegexChanges = {
      '(judge)|(judiciary)': '(judge)|(judiciary)|(panelmember)'
    };
    aatConfig = replaceRolesRegex(baseConfig, rolesRegexChanges);
    aatConfig = mergeConfigs(baseConfig, aatDifferences);
    config = aatConfig;
  } else if (environment === 'preview') {
    let previewConfig = { ...baseConfig };
    previewConfig = mergeConfigs(baseConfig, previewDifferences);
    config = previewConfig;
  }
  return config;
}

//function follows format for rolesRegexChanges as below:
// "{currentRolesRegexKey}": "{newRolesRegexKey}"
function replaceRolesRegex(baseConfig, rolesRegexChanges: object) {
  Object.entries(rolesRegexChanges).forEach(([oldRoleRegex, newRoleRegex]) => {
    if (baseConfig.hasOwnProperty(oldRoleRegex)) {
      baseConfig[newRoleRegex] = baseConfig[oldRoleRegex];
      delete baseConfig[oldRoleRegex];
    }
  });
  return baseConfig;
}

function mergeConfigs(baseConfig, aatConfig) {
  const mergedConfig = { ...baseConfig };
  for (const key in aatConfig) {
    if (aatConfig.hasOwnProperty(key)) {
      if (!mergedConfig[key]) {
        mergedConfig[key] = aatConfig[key];
      } else {
        aatConfig[key].forEach((aatItem) => {
          const baseItem = mergedConfig[key].find((item) => (item.text === aatItem.text) && item.roles);
          if (baseItem) {
            baseItem.roles = Array.from(new Set([...baseItem.roles, ...aatItem.roles]));
          } else {
            mergedConfig[key].push(aatItem);
          }
        });
      }
    }
  }
  return mergedConfig;
}

