export interface UserCredentials {
  readonly email: string;
  readonly password: string;
}

export type UserRole =
  | "caseWorker"
  | "seniorCaseworker"
  | "hearingCentreAdmin"
  | "hearingCentreTeamLead"
  | "judge"
  | "seniorJudge"
  | "respondent"
  | "citizen"
  | "superUser";

interface Config {
  [key: string]: UserCredentials | string;
}

const baseURL = process.env.TEST_URL || "https://manage-case.aat.platform.hmcts.net";

const config: Config = {
  AppBaseURL: baseURL,
  CaseBaseURL: baseURL + "/cases",
};

export default config as {
  [key in UserRole]: UserCredentials;
} & {
  AppBaseURL: string;
  CaseBaseURL: string;
};
