export const aatDifferences = {
  '(judge)|(judiciary)|(panelmember)': [
    {
      'roles': [
        'caseworker-sscs-judge',
        'caseworker-sscs-panelmember'
      ],
      'text': 'My work'
    },
    {
      'roles': [
        'caseworker-sscs-judge',
        'caseworker-sscs-panelmember'
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
