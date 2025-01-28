export enum NoCErrorMap {
  ANSWERS_NOT_IDENTIFY_LITIGANT = 'answers-not-identify-litigant',
  HAS_REPRESENTED = 'has-represented',
  MULTIPLE_NOC_REQUESTS_ON_USER = 'multiple-noc-requests-on-user',
  MULTIPLE_NOC_REQUESTS_ON_CASE = 'multiple-noc-requests-on-case',
  NOC_EVENT_UNAVAILABLE = 'noc-event-unavailable',
  NOC_IN_PROGRESS = 'noc-in-progress',
  NO_ORG_POLICY = 'no-org-policy',
}

export const CASE_REF_DEFAULT_VALIDATION_ERROR = {
  code: 'CASE_REF_DEFAULT_VALIDATION_ERROR',
  message: 'You have either not entered an exact match for the case reference, or the case you are trying to update has not yet been issued. You can retry with a different case number, wait until the case has been issued, or email your local court or Financial Remedy Centre to request the change of legal representative. You should include the 16-digit Financial Remedy case reference in your email.'
};

export const AFFIRMATION_DEFAULT_DISAGREE_ERROR = {
  code: 'AFFIRMATION_DEFAULT_DISAGREE_ERROR',
  message: 'Tick the box to confirm all these details are accurate and match what is written on the case'
};

export const AFFIRMATION_NOTIFY_EVERY_PARTY_ERROR = {
  code: 'AFFIRMATION_NOTIFY_EVERY_PARTY_ERROR',
  message: 'Tick the box to confirm you have served notice of this change on every party to the case, including the former legal representative (if there was one)'
};
