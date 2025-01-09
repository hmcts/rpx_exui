export interface RawJudicialUserModel {
  sidam_id: string;
  object_id: string;
  known_as: string;
  surname: string;
  full_name: string;
  post_nominals: string;
  email_id: string;
  personal_code: string;
  title: string;
  initials: string;
  retirement_date: string;
  active_flag: string;
  is_judge: string;
  is_panel_number: string;
  is_magistrate: string;
}

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
  isJudge: string;
  isMagistrate: string;
  isPanelMember: string;
}

/**
 * @description due to some bad design from rd API below is created,
 * and they said we won't make the changes to keep the model to be consistent as same camelCase as it's live for other users
 * API 1: /refdata/judicial/users/search it's all camelCase from the request and also returns with camelCase in the body.
 * API 2: /refdata/judicial/users it's all snake_case from the request and also returns with snake_case in the body.
 * so we need an unified model from ExUI and transform it to JudicialUserModel for API 2
 */
export function transformToJudicialUserModel(rawJudicialUserModel: RawJudicialUserModel): JudicialUserModel {
  return {
    title: rawJudicialUserModel.title,
    knownAs: rawJudicialUserModel.known_as,
    surname: rawJudicialUserModel.surname,
    fullName: rawJudicialUserModel.full_name,
    emailId: rawJudicialUserModel.email_id,
    idamId: rawJudicialUserModel.sidam_id,
    initials: rawJudicialUserModel.initials,
    postNominals: rawJudicialUserModel.post_nominals,
    personalCode: rawJudicialUserModel.personal_code,
    isJudge: rawJudicialUserModel.is_judge,
    isMagistrate: rawJudicialUserModel.is_magistrate,
    isPanelMember: rawJudicialUserModel.is_panel_number
  };
}
