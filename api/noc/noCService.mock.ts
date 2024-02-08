import * as MockAdapter from 'axios-mock-adapter';
import * as faker from 'faker/locale/en_GB';
import { httpMock } from './httpMock';
import { NoCQuestion } from './models/noCQuestion.interface';

// random generator
export const generator = (schema, min = 1, max) => {
  max = max || min;
  return Array.from({
    length: faker.random.number({
      min,
      max
    })
  }).map(() => {
    const innerGen = (anySchema) => Object.keys(anySchema).reduce((entity, key) => {
      if (anySchema[key] instanceof Array || anySchema[key] === null) {
        entity[key] = anySchema[key];
        return entity;
      }
      if (Object.prototype.toString.call(anySchema[key]) === '[object Object]') {
        entity[key] = innerGen(anySchema[key]);
        return entity;
      }
      entity[key] = faker.fake(anySchema[key]);
      return entity;
    }, {});

    return innerGen(schema);
  });
};

export const init = () => {
  const mock: MockAdapter = new MockAdapter(httpMock);

  // schema
  const questionsSchema: NoCQuestion[] = [
    {
      case_type_id: 'AAT',
      order: '1',
      question_text: 'What is their first name?',
      answer_field_type: {
        id: 'Text',
        type: 'Text',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '2',
      question_text: 'What is their last name?',
      answer_field_type: {
        id: 'Text',
        type: 'Text',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '3',
      question_text: 'Do they have children?',
      answer_field_type: {
        id: 'YesOrNo',
        type: 'YesOrNo',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '4',
      question_text: 'How many children do they have?',
      answer_field_type: {
        id: 'Number',
        type: 'Number',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '5',
      question_text: 'What is their telephone number?',
      answer_field_type: {
        id: 'PhoneUK',
        type: 'PhoneUK',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '6',
      question_text: 'What is their postcode?',
      answer_field_type: {
        id: 'Postcode',
        type: 'Postcode',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '7',
      question_text: 'What is their Email?',
      answer_field_type: {
        id: 'Email',
        type: 'Email',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '8',
      question_text: 'What is the current date?',
      answer_field_type: {
        id: 'Date',
        type: 'Date',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '9',
      question_text: 'What is the current date and time?',
      answer_field_type: {
        id: 'DateTime',
        type: 'DateTime',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    },
    {
      case_type_id: 'AAT',
      order: '10',
      question_text: 'What is the current time?',
      answer_field_type: {
        id: 'Time',
        type: 'Time',
        min: null,
        max: null,
        regular_expression: null,
        fixed_list_items: [],
        complex_fields: [],
        collection_field_type: null
      },
      display_context_parameter: '1',
      challenge_question_id: 'NoC',
      answer_field: null,
      question_id: 'QuestionId{{random.number}}'
    }
  ];

  const getNoCQuestionsUrl = /\/api\/noc\/nocQuestions\?caseId/;
  const validateNoCQuestionsUrl = /\/api\/noc\/validateNoCQuestions/;
  const postNoCEventsUrl = /\/api\/noc\/submitNoCEvents/;

  // simulate some error if needed
  // mock.onGet(url).networkErrorOnce()
  // mock.onGet(getNoCQuestionsUrl).timeoutOnce()

  mock.onGet(getNoCQuestionsUrl).reply(() => {
    let questions = [];

    questionsSchema.map((schema) => {
      questions = [...questions, ...generator(schema, 1, 1)];
    });

    questions.sort((a, b) => a.order > b.order ? 1 : -1);

    // return an array in the form of [status, data, headers]
    return [
      200,
      questions
    ];
  })
  // success
    .onPost(validateNoCQuestionsUrl).reply(200, {
      OrganisationPolicy: {
        Organisation: 'orgId'
      },
      code: '',
      status_message: 'success'
    })
  // EUI-2397: scenario 1
  // answers are incomplete/incorrect
  /*  .onPost(validateNoCQuestionsUrl).reply(400, {
    code: 'answers-not-matched-any-litigant',
    status_message: 'Answers are incorrect and do not match system record',
  })*/
  // EUI-2397: scenario 2
  // matched more than one party
  /*  .onPost(validateNoCQuestionsUrl).reply(400, {
    code: 'answers-not-identify-litigant',
    status_message: 'Answers match more than one party on the case',
  })*/
  // EUI-2397: scenario 3
  // invalid case reference
  /*  .onPost(validateNoCQuestionsUrl).reply(400, {
    code: 'case-id-invalid',
    status_message: 'invalid case reference',
  })*/
  // EUI-2397: scenario 4
  // organisation already has access to this case
  /*  .onPost(validateNoCQuestionsUrl).reply(400, {
    code: 'has-represented',
    status_message: 'Your organisation already has access to this case',
  })*/
  // EUI-2397: scenario 5
  // noc in progress
  /*  .onPost(validateNoCQuestionsUrl).reply(400, {
      code: 'noc-in-progress',
      status_message: 'The case has an ongoing NoC Request',
  })*/
  // EUI-2401
  // any other server errors
  /*  .onPost(validateNoCQuestionsUrl).reply(500, {
      code: 'generic-error',
      status_message: 'internal error',
  })*/
  // EUI-2322
  // Scenario 1
  /* .onPost(postNoCEventsUrl).reply(201, {
    approval_status: 'PENDING',
    case_role: 'Claimant',
    code: '',
    status_message: 'success',
  }) */
  // EUI-2322
  // Scenario 2
    .onPost(postNoCEventsUrl).reply(201, {
      approval_status: 'APPROVED',
      case_role: 'Claimant',
      code: '',
      status_message: 'success'
    });
  // EUI-2323
  // Scenario 1
  /*  .onPost(postNoCEventsUrl).reply(500, {
    code: 'noc-in-progress',
    message: 'internal error',
  }) */
  // EUI-2323
  // Scenario 2
  // .onGet(getNoCQuestionsUrl).networkError();
  // EUI-2385
  // Scenario 1
  /* .onPost(postNoCEventsUrl).reply(400, {
    code: 'case-id-invalid',
    message: 'Invalid answer',
  }) */
  // EUI-2385
  // Scenario 2
  /*  .onPost(postNoCEventsUrl).reply(400, {
    code: 'answers-not-identify-litigant',
    message: 'Answers match more than one party on the case',
  })*/
  // EUI-2385
  // Scenario 3
  /* .onPost(postNoCEventsUrl).reply(400, {
    code: 'case-id-invalid',
    message: 'Invalid case reference number',
  }) */
  // EUI-2385
  // Scenario 4
  /* .onPost(postNoCEventsUrl).reply(400, {
    code: 'more-than-one-litigant',
    message: 'You already have access to the case',
  }) */
  // EUI-2385
  // Scenario 5
  /* .onPost(postNoCEventsUrl).reply(400, {
    code: 'noc-in-progress',
    message: 'NOC in progress',
  }) */
  // EUI-2385
  // Scenario 6
  /* .onPost(postNoCEventsUrl).reply(400, {
    code: 'noc-in-progress',
    message: 'Another NOC request has been actioned',
  }) */
};
