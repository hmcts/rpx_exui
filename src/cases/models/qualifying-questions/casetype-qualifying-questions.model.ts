import { QualifyingQuestion } from './qualifying-question.model';

export interface CaseTypeQualifyingQuestions {
  caseTypeId: string;
  qualifyingQuestions: QualifyingQuestion[];
}
