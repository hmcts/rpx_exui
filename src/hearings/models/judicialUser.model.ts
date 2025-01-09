export interface JudicialUserModel {
  title: string;
  knownAs: string;
  surname: string;
  fullName: string;
  emailId: string;
  idamId: string;
  initials: string;
  postNominals: string;
  personalCode: string;
  isJudge?: string;
  isMagistrate?: string;
  isPanelMember?: string;
}
