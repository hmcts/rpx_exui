export enum TypeOfRole {
  LeadJudge = 'Lead judge',
  HearingJudge = 'Hearing judge',
  CaseManager = 'Case manager'
}

// kept two admin references as seem to be used alternately
export enum RoleCategory {
  JUDICIAL = 'JUDICIAL',
  LEGAL_OPERATIONS = 'LEGAL_OPERATIONS',
  ADMIN = 'ADMIN',
  CTSC = 'CTSC'
}

export enum AllocateTo {
  ALLOCATE_TO_ME = 'Allocate to me',
  ALLOCATE_TO_ANOTHER_PERSON = 'Allocate to another person',
  REALLOCATE_TO_ANOTHER_PERSON = 'Reallocate to another person',
}

export enum DurationOfRole {
  SEVEN_DAYS = '7 days',
  INDEFINITE = 'Indefinite',
  ANOTHER_PERIOD = 'Another period',
}

export enum Actions {
  Allocate = 'allocate',
  Complete = 'complete',
  Reallocate = 'reallocate',
  Remove = 'remove'
}

export interface Period {
  startDate: Date;
  endDate?: Date;
}
