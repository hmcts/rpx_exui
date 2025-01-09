
module.exports = {
    caseworker: {
        "WA1": ["caseworker", "caseworker-ia", "caseworker-ia-caseofficer" ],
        "WA2": ["case-allocator","caseworker", "caseworker-ia", "caseworker-ia-caseofficer"],
        "WA2-SUPERVISOR": ["caseworker", "caseworker-ia", "caseworker-ia-caseofficer","task-supervisor"],
        "NON-WA": ["caseworker", "caseworker-divorce", "caseworker-divorce-financialremedy","caseworker-divorce-financialremedy-courtadmin"],
        "GLOBAL-SEARCH": ["caseworker", "caseworker-ia", "caseworker-ia-caseofficer"],
        "REFUNDS": ["caseworker", "caseworker-divorce", "caseworker-divorce-financialremedy", "caseworker-divorce-financialremedy-courtadmin", "payments-refund", "payments-refund-approver"],
       
    },
    judicial:{
        "WA2": ["task-supervisor","caseworker", "caseworker-ia", "caseworker-ia-iacjudge", "judge"],
        "WA2-SUPERVISOR": ["caseworker", "caseworker-ia", "caseworker-ia-iacjudge", "task-supervisor", "judge"],
        "NON-WA": ["caseworker", "caseworker-divorce", "caseworker-divorce-financialremedy","caseworker-divorce-judge", "judge"],
        "GLOBAL-SEARCH": ["caseworker", "caseworker-ia", "caseworker-ia-iacjudge", "judge"]
    },
    solicitor:{
        "NOC": ["pui-caa", "pui-case-manager", "pui-user-manager","pui-organisation-manager","caseworker", "caseworker-divorce", "caseworker-divorce-financialremedy","caseworker-divorce-solicitor"],
        "NON-NOC": ["pui-caa", "pui-case-manager", "pui-user-manager", "pui-organisation-manager", "caseworker", "caseworker-divorce", "caseworker-divorce-financialremedy", "caseworker-divorce-financialremedy-solicitor"]
    }
   
}