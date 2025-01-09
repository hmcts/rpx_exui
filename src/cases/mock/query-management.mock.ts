/**
 * This mock file should be deleted after integrating with CCD
 * CCD development ticket: https://tools.hmcts.net/jira/browse/CCD-4590
 * ExUI tickets:
 *   https://tools.hmcts.net/jira/browse/EUI-8460
 *   https://tools.hmcts.net/jira/browse/EUI-8388
 *   https://tools.hmcts.net/jira/browse/EUI-8389
 */
export const caseMessagesMockData = [
  {
    partyName: 'John Smith - Appellant',
    roleOnCase: null,
    caseMessages: [
      {
        id: 'ccd-message-id-001',
        value: {
          id: 'case-message-001',
          subject: 'Review attached document',
          name: 'Maggie Conroy',
          body: 'Please review attached document and advise if hearing should proceed?',
          attachments: [
            {
              id: 'ccd-document-id-001',
              value: {
                document_filename: 'Screenshot 2023-06-01 at 16.07.06.png',
                document_url: 'https://dm-store-aat.service.core-compute-aat.internal/documents/e5366837-b3f6-492d-acbf-548730625e8f',
                document_binary_url: 'https://dm-store-aat.service.core-compute-aat.internal/documents/e5366837-b3f6-492d-acbf-548730625e8f/binary'
              }
            },
            {
              id: 'ccd-document-id-002',
              value: {
                document_filename: 'dummy.pdf',
                document_url: 'https://dm-store-aat.service.core-compute-aat.internal/documents/f50ccd7a-7f28-40f3-b5f9-7ad2f6425506',
                document_binary_url: 'https://dm-store-aat.service.core-compute-aat.internal/documents/f50ccd7a-7f28-40f3-b5f9-7ad2f6425506/binary'
              }
            }
          ],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 0, 3),
          createdBy: '1111-1111-1111-1111'
        }
      },
      {
        id: 'ccd-message-id-001',
        value: {
          id: 'case-message-002',
          subject: 'Games',
          name: 'Maggie Conroy',
          body: 'Can I play games in my phone when my solicitor is talking?',
          attachments: [
            {
              id: 'ccd-document-id-003',
              value: {
                document_filename: 'talking-document.pdf',
                document_url: '/',
                document_binary_url: '/'
              }
            }
          ],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 0, 3),
          createdBy: '1111-1111-1111-1111'
        }
      },
      {
        id: 'ccd-message-id-003',
        value: {
          id: 'case-message-003',
          name: 'John Smith',
          body: 'Using mobile phone is strictly prohibited in the court room.',
          attachments: [
            {
              id: 'ccd-document-id-004',
              value: {
                document_filename: 'games-document.pdf',
                document_url: '/',
                document_binary_url: '/'
              }
            }
          ],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 2, 4),
          createdBy: '2222-2222-2222-2222',
          parentId: 'case-message-002'
        }
      },
      {
        id: 'ccd-message-id-004',
        value: {
          id: 'case-message-004',
          name: 'Maggie Conroy',
          body: 'Can I use a tablet instead?',
          attachments: [],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 3, 8),
          createdBy: '2222-2222-2222-2222',
          parentId: 'case-message-003'
        }
      },
      {
        id: 'ccd-message-id-005',
        value: {
          id: 'case-message-005',
          name: 'John Smith',
          body: 'No, you cannot use a tablet either.',
          attachments: [],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 4, 24),
          createdBy: '2222-2222-2222-2222',
          parentId: 'case-message-004'
        }
      }
    ]
  },
  {
    partyName: 'Kevin Peterson - Respondent',
    roleOnCase: null,
    caseMessages: [
      {
        id: 'ccd-message-id-006',
        value: {
          id: 'case-message-006',
          subject: 'Add respondent detention order',
          name: 'Maggie Conroy',
          body: 'Please add respondent detention order to the file XX20230423-DX.',
          attachments: [],
          isHearingRelated: 'Yes',
          createdOn: new Date(2023, 1, 5),
          createdBy: '1111-1111-1111-1111'
        }
      },
      {
        id: 'ccd-message-id-007',
        value: {
          id: 'case-message-007',
          name: 'Maggie Conroy',
          body: 'I confirm that the respondent detention order is now added to the file XX20230423-DX.',
          attachments: [],
          isHearingRelated: 'Yes',
          createdOn: new Date(2023, 1, 6),
          createdBy: '2222-2222-2222-2222',
          parentId: 'case-message-006'
        }
      },
      {
        id: 'ccd-message-id-008',
        value: {
          id: 'case-message-008',
          subject: 'Food',
          name: 'Maggie Conroy',
          body: 'Can I eat in the hearings?',
          attachments: [],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 0, 3),
          createdBy: '1111-1111-1111-1111'
        }
      },
      {
        id: 'ccd-message-id-009',
        value: {
          id: 'case-message-009',
          name: 'Maggie Conroy',
          body: 'Consumption of food is not allowed when a hearing is taking place.',
          attachments: [],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 0, 5),
          createdBy: '2222-2222-2222-2222',
          parentId: 'case-message-008'
        }
      },
      {
        id: 'ccd-message-id-010',
        value: {
          id: 'case-message-010',
          subject: 'Bring relatives',
          name: 'Maggie Conroy',
          body: 'Can I bring my grandma with me so she get out from the residence?',
          attachments: [],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 0, 6),
          createdBy: '1111-1111-1111-1111'
        }
      },
      {
        id: 'ccd-message-id-011',
        value: {
          id: 'case-message-011',
          name: 'Maggie Conroy',
          body: 'Sorry, only those required for the hearing should be present inside the court room.',
          attachments: [],
          isHearingRelated: 'Yes',
          hearingDate: '2023-01-10',
          createdOn: new Date(2023, 0, 7),
          createdBy: '2222-2222-2222-2222',
          parentId: 'case-message-010'
        }
      }
    ]
  }
];
