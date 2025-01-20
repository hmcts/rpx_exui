export const aatDifferences = {
  '(judge)|(judiciary)|(panelmember)': [
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
        'caseworker-st_cic',
        'caseworker-sscs-registrar'
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
