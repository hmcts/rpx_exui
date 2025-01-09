export const environment = {
  production: true,
  loggingLevel: 'OFF',
  cookies: {
    token: '__auth__',
    userId: '__userid__',
    roles: 'roles'
  },
  googleAnalyticsKey: 'UA-124734893-1',
  googleTagManagerKey: 'GTM-TQ7PKDF',
  themes: {
    '(judge)|(judiciary)': { appTitle: { name: 'Judicial Case Manager', url: '/' }, backgroundColor: '#8d0f0e', logo: 'judicial' },
    'pui-case-manager': { appTitle: { name: 'Manage Cases', url: '/' }, backgroundColor: '#202020', logo: 'myhmcts' },
    '.+': { appTitle: { name: 'Manage Cases', url: '/' }, backgroundColor: '#202020', logo: 'none' }
  }
};

/**
 * Do not add configuration to this file if possible
 * Instead add it to config.json file that gets loaded through APP_INITIALIZER;
 * and consume it through the configuration.service.ts
 */
