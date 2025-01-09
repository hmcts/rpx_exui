import { LocationApi } from './common';

export interface ServiceUserDetailList {
  service: string;
  staffUserList: StaffUserDetails[];
}

export interface StaffUserDetails {
  ccd_service_name: string;
  ccd_service_names?: string[];
  staff_profile: StaffProfile;
}

export interface StaffProfile {
  id: string;
  first_name: string;
  last_name: string;
  region_id: string;
  user_type: string;
  idam_roles: string;
  suspended: string;
  case_allocator: string;
  task_supervisor: string;
  staff_admin: string;
  created_time: Date;
  last_updated_time: Date;
  email_id: string;
  region: string;
  base_location: LocationApi[];
  user_type_id: string;
  role: RoleApi[];
  skills: Skill[];
  work_area: WorkArea[];
}

export interface RoleApi {
  role_id: string;
  role: string;
  is_primary: boolean;
}

export interface Skill {
  skill_id: string;
  skill_code: string;
  description: string;
}

export interface WorkArea {
  service_code: string;
  area_of_work: string;
}
