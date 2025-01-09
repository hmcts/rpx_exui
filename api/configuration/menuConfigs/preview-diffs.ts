export const previewDifferences = {
  '(judge)|(judiciary)': [
    {
      'roles': [
        'caseworker-sscs-judge',
        'caseworker-sscs-panelmember',
        'caseworker-st_cic'
      ],
      'text': 'My work'
    },

    {
      'roles': [
        'caseworker-st_cic'
      ],
      'text': 'Case list'
    },
    {
      'roles': [
        'caseworker-st_cic'
      ],
      'text': 'Find case'
    },
    {
      'roles': [
        'caseworker-employment-etjudge',
        'caseworker-sscs-judge',
        'caseworker-sscs-panelmember',
        'caseworker-st_cic'
      ],
      'text': 'Search'
    }
  ],
  '(pui-case-manager)': [
    {
      'roles': [
        'caseworker-civil',
        'caseworker-civil-solictor',
        'caseworker-befta_master-solicitor'
      ],
      'text': 'Notice of change'
    }
  ],
  '.+': [
    {
      'roles': [
        'caseworker-sscs-clerk',
        'caseworker-sscs-registrar',
        'caseworker-st_cic'
      ],
      'text': 'My work'
    },
    {
      'roles': [
        'caseworker-sscs-clerk',
        'caseworker-sscs-registrar'
      ],
      'text': 'Search'
    }
  ]
};
