
const prToTestInDemo = [

];

const mathingPreviewToDemo = prToTestInDemo.filter((conf) => process.env.TEST_URL && process.env.TEST_URL.includes(conf.previewUrl));
if (mathingPreviewToDemo.length === 1){
  process.env.TEST_ENV='demo';
  process.env.TEST_URL = mathingPreviewToDemo[0].demoUrl;
}

function getTestENVFromEnvironment(){
  return process.env.TEST_ENV !== undefined && (process.env.TEST_ENV.includes('aat') || process.env.TEST_ENV.includes('demo')) ? process.env.TEST_ENV : 'aat';
}

const data = {
  getTestEnvFromEnviornment: getTestENVFromEnvironment,
  testEnv: getTestENVFromEnvironment(),
  users: {
    aat: [
      {
        idamId: '12b6a360-7f19-4985-b065-94320a891eaa',
        email: 'lukesuperuserxui_new@mailnesia.com',
        release: 'general', userIdentifier: 'PROD_LIKE',
        key: 'Monday01'
      },
      {
        idamId: '4801cdad-f612-4288-9e03-70a659cc7b36',
        email: 'townley.winchester@mailnesia.com',
        release: 'general', userIdentifier: 'SOLICITOR',
        key: 'Monday01'
      },
      {
        idamId: '12b6a360-7f19-4985-b065-94320a891eaa',
        email: 'xui_auto_co_r1@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_CaseOfficer_R1',
        key: 'Welcome01'
      },
      {
        idamId: '3db21928-cbbc-4364-bd91-137c7031fe17',
        email: 'CRD_func_test_aat_tcw@justice.gov.uk',
        release: 'wa_release_2', userIdentifier: 'IAC_CaseOfficer_R2',
        key: 'AldgateT0wer'
      },
      {
        idamId: '7cfa4921-ecbe-4a0c-ba67-543201b9cde9',
        email: 'xui_auto_adm_r1@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_AdmOfficer_R1',
        key: 'Welcome01'
      },
      {
        idamId: '4beb7bbe-5cc9-4f92-9c4d-620bd705dc8a',
        email: 'xui_auto_adm_r2@justice.gov.uk',
        release: 'wa_release_2', userIdentifier: 'IAC_AdmOfficer_R2',
        key: 'Welcome01'
      },
      {
        idamId: '4fd5803c-a1ae-4790-b735-dc262e8322b8',
        email: 'xui_iac_judge_1@mailinator.com',
        release: 'wa_release_1', userIdentifier: 'IAC_Judge_WA_R1',
        key: 'Welcome01'
      },
      {
        idamId: '38eb0c5e-29c7-453e-b92d-f2029aaed6c3',
        email: 'xui_iac_judge_2@mailinator.com',
        release: 'wa_release_2', userIdentifier: 'IAC_Judge_WA_R2',
        key: 'Welcome01'
      },
      {
        idamId: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
        email: 'juser8@mailinator.com',
        release: 'wa_release_2', userIdentifier: 'IAC_Judge_WA_R2_CaseAllocator',
        key: 'Welcome01'
      },

      {
        idamId: '10c6b21d-5bd0-4047-8ca6-bb3dd4e83c9c',
        email: 'xui_auto_co_r1_withPagination@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_CaseOfficer_R1_withPagination',
        key: 'Welcome01'
      },

      {
        idamId: '16ce0689-bea9-4bd8-add0-722291656529',
        email: 'xui_auto_co_r1_withoutPagination@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_CaseOfficer_R1_withoutPagination',
        key: 'Welcome01'
      },
      {
        idamId: 'ae28c49a-ad0f-467a-a480-15fcaa66165d',
        email: 'exuigsuser@mailinator.com',
        release: 'general', userIdentifier: 'CASEWORKER_GLOBALSEARCH',
        key: 'Welcome01'
      },
      {
        idamId: 'ae28c49a-ad0f-467a-a480-15fcaa66165d',
        email: 'exuigsuser@mailinator.com',
        release: 'general', userIdentifier: 'WA2',
        key: 'Welcome01'
      },
      {
        idamId: 'ae28c49a-ad0f-467a-a480-15fcaa66165d',
        email: 'exuigsuser@mailinator.com',
        release: 'general', userIdentifier: 'WA2_GLOBAL-SEARCH',
        key: 'Welcome01'
      },
      {
        idamId: '7381c1ae-9cc9-4251-b283-727feef94a3d',
        email: 'xui_bookingui_on@hmcts.net',
        release: 'bookingui-WA3', userIdentifier: 'BOOKING_UI-FT-ON',
        key: 'Monday01'
      }

    ],
    demo: [
      {
        idamId: '12b6a360-7f19-4985-b065-94320a891eaa',
        email: 'peterxuisuperuser@mailnesia.com',
        release: 'general', userIdentifier: 'PROD_LIKE',
        key: 'Monday01'
      },
      {
        idamId: '12b6a360-7f19-4985-b065-94320a891eaa',
        email: 'lukesuperuserxui_new@mailnesia.com',
        release: 'general', userIdentifier: 'SOLICITOR'
      },
      {
        idamId: '12b6a360-7f19-4985-b065-94320a891eaa',
        email: 'xui_auto_co_r1@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_CaseOfficer_R1'
      },
      {
        idamId: '3db21928-cbbc-4364-bd91-137c7031fe17',
        email: 'CRD_func_test_demo_stcw@justice.gov.uk',
        release: 'wa_release_2', userIdentifier: 'IAC_CaseOfficer_R2',
        key: 'AldgateT0wer'
      },
      {
        idamId: '7cfa4921-ecbe-4a0c-ba67-543201b9cde9',
        email: 'xui_auto_adm_r1@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_AdmOfficer_R1'
      },
      {
        idamId: '4beb7bbe-5cc9-4f92-9c4d-620bd705dc8a',
        email: 'xui_auto_adm_r2@justice.gov.uk',
        release: 'wa_release_2', userIdentifier: 'IAC_AdmOfficer_R2'
      },
      {
        idamId: '4fd5803c-a1ae-4790-b735-dc262e8322b8',
        email: 'xui_iac_judge_1@mailinator.com',
        release: 'wa_release_1', userIdentifier: 'IAC_Judge_WA_R1'
      },
      {
        idamId: '519e0c40-d30e-4f42-8a4c-2c79838f0e4e',
        email: '330085EMP-@ejudiciary.net',
        release: 'wa_release_2', userIdentifier: 'IAC_Judge_WA_R2',
        key: 'Hmcts1234'
      },
      {
        idamId: '44d5d2c2-7112-4bef-8d05-baaa610bf463',
        email: 'juser8@mailinator.com',
        release: 'wa_release_2', userIdentifier: 'IAC_Judge_WA_R2_CaseAllocator'
      },

      {
        idamId: '10c6b21d-5bd0-4047-8ca6-bb3dd4e83c9c',
        email: 'xui_auto_co_r1_withPagination@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_CaseOfficer_R1_withPagination'
      },

      {
        idamId: '16ce0689-bea9-4bd8-add0-722291656529',
        email: 'xui_auto_co_r1_withoutPagination@justice.gov.uk',
        release: 'wa_release_1', userIdentifier: 'IAC_CaseOfficer_R1_withoutPagination'
      },
      {
        idamId: 'db17f6f7-1abf-4223-8b5e-1eece04ee5d8',
        email: 'CRD_func_test_demo_stcw@justice.gov.uk',
        release: 'general', userIdentifier: 'CASEWORKER_GLOBALSEARCH',
        key: 'AldgateT0wer'
      },

      {
        idamId: '4beb7bbe-5cc9-4f92-9c4d-620bd705dc8a',
        email: 'test@mailnesia.com',
        release: 'general', userIdentifier: 'WA2'
      },

      {
        idamId: '810b5601-4a8a-4c82-9294-34f087f2e67f',
        email: 'test@mailnesia.com',
        release: 'general', userIdentifier: 'WA2_GLOBAL-SEARCH'
      },
      {
        idamId: '7381c1ae-9cc9-4251-b283-727feef94a3d',
        email: '271205EMP-@ejudiciary.net',
        release: 'bookingui-WA3', userIdentifier: 'BOOKING_UI-FT-ON',
        key: 'Hmcts1234'
      }

    ]
  },
  appFeatures: {
    primaryTabs: {
      judge: {
        wa_release_1: ['Case list'],
        wa_release_2: ['Case list', 'My work', 'All work', 'Find case']
      },
      caseworker: {
        wa_release_1: ['Case list', 'Create case', 'Task list', 'Task manager', 'Find case'],
        wa_release_2: ['Case list', 'Create case', 'My work', 'All work', 'Find case']
      }
    },
    taskListColumns: {
      myTasks: {
        wa_release_1: ['Case reference', 'Case name', 'Case category', 'Location', 'Task', 'Date'],
        wa_release_2: ['Case name', 'Case category', 'Location', 'Task', 'Date']
      },
      availableTasks: {
        wa_release_1: ['Case reference', 'Case name', 'Case category', 'Location', 'Task', 'Date'],
        wa_release_2: ['Case name', 'Case category', 'Location', 'Task', 'Date']
      }

    }
  }
};

module.exports = data;

