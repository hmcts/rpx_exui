const menuConfig = {
  '(judge)|(judiciary)': [
    {
      'active': true,
      'flags': [
        'MC_Work_Allocation',
        {
          'flagName': 'mc-work-allocation-active-feature',
          'value': 'WorkAllocationRelease2'
        }
      ],
      'href': '/work/my-work/list',
      'roles': [
        'caseworker-civil',
        'caseworker-ia-iacjudge',
        'caseworker-privatelaw',
        'caseworker-publiclaw',
        'caseworker-employment-etjudge'
      ],
      'text': 'My work'
    },
    {
      'active': false,
      'flags': [
        'MC_Work_Allocation',
        {
          'flagName': 'mc-work-allocation-active-feature',
          'value': 'WorkAllocationRelease2'
        }
      ],
      'href': '/work/all-work/tasks',
      'roles': [
        'task-supervisor'
      ],
      'text': 'All work'
    },
    {
      'active': false,
      'href': '/cases',
      'roles': [
        'caseworker-sscs-judge',
        'caseworker-sscs-panelmember',
        'caseworker-cmc-judge',
        'caseworker-divorce-judge',
        'caseworker-divorce-financialremedy-judiciary',
        'caseworker-probate-judge',
        'caseworker-ia-iacjudge',
        'caseworker-civil',
        'caseworker-privatelaw',
        'caseworker-publiclaw-judiciary',
        'caseworker-employment-etjudge'
      ],
      'text': 'Case list'
    },
    {
      'active': false,
      'flags': [
        'feature-global-search'
      ],
      'href': '/cases/case-search',
      'ngClass': 'hmcts-search-toggle__button',
      'roles': [
        'caseworker-sscs-judge',
        'caseworker-sscs-panelmember',
        'caseworker-cmc-judge',
        'caseworker-divorce-judge',
        'caseworker-divorce-financialremedy-judiciary',
        'caseworker-probate-judge',
        'caseworker-publiclaw-judiciary',
        'caseworker-employment-etjudge'
      ],
      'text': 'Find case'
    },
    {
      'active': false,
      'flags': [
        'feature-global-search'
      ],
      'href': '/search',
      'roles': [
        'caseworker-civil',
        'caseworker-ia-iacjudge',
        'caseworker-privatelaw',
        'caseworker-publiclaw',
        'caseworker-st_cic-judge',
        'caseworker-st_cic-senior-judge',
        'caseworker-employment-etjudge'
      ],
      'text': 'Search'
    },
    {
      'active': false,
      'align': 'right',
      'href': '/cases/case-search',
      'ngClass': 'hmcts-search-toggle__button',
      'notFlags': [
        'feature-global-search'
      ],
      'text': 'Find case'
    },
    {
      'active': false,
      'href': '/booking',
      'roles': [
        'fee-paid-judge'
      ],
      'text': 'Work access'
    },
    {
      'active': true,
      'align': 'right',
      'flags': [
        'feature-global-search'
      ],
      'href': '/cases/case-search',
      'ngClass': 'hmcts-search-toggle__button',
      'text': '16-digit-ref-search'
    }
  ],
  '(pui-case-manager)': [
    {
      'active': false,
      'href': '/cases',
      'text': 'Case list'
    },
    {
      'active': false,
      'href': '/cases/case-filter',
      'text': 'Create case'
    },
    {
      'active': false,
      'flags': [
        'MC_Notice_of_Change'
      ],
      'href': '/noc',
      'roles': [
        'caseworker-divorce-solicitor',
        'caseworker-probate-solicitor',
        'caseworker-privatelaw-solicitor'
      ],
      'text': 'Notice of change'
    },
    {
      'active': false,
      'align': 'right',
      'href': '/cases/case-search',
      'ngClass': 'hmcts-search-toggle__button',
      'text': 'Find case'
    }
  ],
  '.+': [
    {
      'active': true,
      'flags': [
        'MC_Work_Allocation',
        {
          'flagName': 'mc-work-allocation-active-feature',
          'value': 'WorkAllocationRelease2'
        }
      ],
      'href': '/work/my-work/list',
      'roles': [
        'caseworker-civil',
        'caseworker-civil-staff',
        'caseworker-ia-caseofficer',
        'caseworker-ia-admofficer',
        'caseworker-privatelaw',
        'caseworker-publiclaw',
        'caseworker-employment'
      ],
      'text': 'My work'
    },
    {
      'active': false,
      'flags': [
        'MC_Work_Allocation',
        {
          'flagName': 'mc-work-allocation-active-feature',
          'value': 'WorkAllocationRelease2'
        }
      ],
      'href': '/work/all-work/tasks',
      'roles': [
        'task-supervisor'
      ],
      'text': 'All work'
    },
    {
      'active': false,
      'flags': [
        'MC_Work_Allocation',
        {
          'flagName': 'mc-work-allocation-active-feature',
          'value': 'WorkAllocationRelease1'
        }
      ],
      'href': '/tasks',
      'roles': [
        'caseworker-ia-caseofficer'
      ],
      'text': 'Task list'
    },
    {
      'active': false,
      'flags': [
        'MC_Work_Allocation',
        {
          'flagName': 'mc-work-allocation-active-feature',
          'value': 'WorkAllocationRelease1'
        }
      ],
      'href': '/tasks/task-manager',
      'roles': [
        'caseworker-ia-caseofficer',
        'task-supervisor'
      ],
      'text': 'Task manager'
    },
    {
      'active': false,
      'href': '/cases',
      'roles': [
        'caseworker-caa',
        'caseworker-divorce',
        'caseworker-sscs',
        'caseworker-adoption',
        'caseworker-civil',
        'caseworker-cmc',
        'caseworker-employment',
        'caseworker-privatelaw',
        'caseworker-hrs',
        'caseworker-probate',
        'caseworker-ia',
        'caseworker-publiclaw',
        'caseworker-st_cic'
      ],
      'text': 'Case list'
    },
    {
      'active': false,
      'href': '/cases/case-filter',
      'text': 'Create case'
    },
    {
      'active': false,
      'flags': [
        'feature-global-search'
      ],
      'href': '/cases/case-search',
      'ngClass': 'hmcts-search-toggle__button',
      'roles': [
        'caseworker-caa',
        'caseworker-divorce',
        'caseworker-sscs',
        'caseworker-adoption',
        'caseworker-civil',
        'caseworker-cmc',
        'caseworker-employment',
        'caseworker-privatelaw',
        'caseworker-hrs',
        'caseworker-probate',
        'caseworker-publiclaw',
        'caseworker-publiclaw-courtadmin',
        'caseworker-st_cic'
      ],
      'text': 'Find case'
    },
    {
      'active': false,
      'flags': [
        'feature-global-search'
      ],
      'href': '/search',
      'roles': [
        'caseworker-civil',
        'caseworker-ia-caseofficer',
        'senior-tribunal-caseworker',
        'tribunal-caseworker',
        'caseworker-ia-admofficer',
        'caseworker-befta_master',
        'caseworker-privatelaw',
        'caseworker-publiclaw',
        'caseworker-st_cic',
        'caseworker-st_cic-senior-caseworker',
        'caseworker-sscs',
        'caseworker-employment'
      ],
      'text': 'Search'
    },
    {
      'active': false,
      'flags': [
        'feature-refunds'
      ],
      'href': '/refunds',
      'roles': [
        'payments-refund-approver',
        'payments-refund'
      ],
      'text': 'Refunds'
    },
    {
      'active': false,
      'align': 'right',
      'href': '/cases/case-search',
      'ngClass': 'hmcts-search-toggle__button',
      'notFlags': [
        'feature-global-search'
      ],
      'text': 'Find case'
    },
    {
      'active': false,
      'align': 'right',
      'flags': [
        'feature-global-search'
      ],
      'href': '',
      'text': 'Find case'
    },
    {
      'active': false,
      'flags': [],
      'href': '/staff',
      'roles': [
        'staff-admin'
      ],
      'text': 'Staff'
    }
  ]
};

module.exports = menuConfig