export interface CaseList {
  cases: Case[];
}

export interface Case {
  id: string;
  type: string;
  task_state: string;
  task_system: string;
  security_classification: string;
  task_title: string;
  created_date: string;
  due_date: string;
  location_name?: string;
  location: string;
  jurisdiction: string;
  region: string;
  case_data?: CaseInternalData;
  case_type_id: string;
  case_id: string;
  case_category: string;
  case_name: string;
  auto_assigned: boolean;
  actions: CaseAction[];
  execution_type: string;
  assignee: string;
  dueDate: string;
  taskName: string;
  caseName: string;
  caseCategory: string;
  assigneeName: string;
  name: string;
  isNew?: boolean;
  hearing_date?: string;
}

export interface CaseAction {
  id: string;
  title: string;
}

export interface CaseInternalData {
  caseName?: string;
  hmctsCaseCategory?: string;
  caseManagementCategory?: CaseManagementCategory;
  caseManagementLocation?: CaseManagementLocation;
  hmctsCaseNameInternal?: string;
  nextHearingDetails?: {hearingDateTime: Date};
  caseNameHmctsInternal?: string;
}

export interface CaseManagementLocation {
  baseLocation: string;
  region: string;
}

export interface CaseManagementCategory {
  value: CaseManagementCategoryData,
  list_items: CaseManagementCategoryData[]
}

export interface CaseManagementCategoryData {
  code: string;
  label: string;
}
