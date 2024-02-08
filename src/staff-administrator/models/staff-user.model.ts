import { StaffUserIDAMStatus } from './staff-user-idam-status.enum';
import { StaffUserLocation } from './staff-user-location.model';

export class StaffUser {
  public case_worker_id: string;
  public email_id: string;
  public first_name: string;
  public last_name: string;
  public suspended: boolean;
  public user_type: string;

  public task_supervisor: boolean;
  public case_allocator: boolean;
  public staff_admin: boolean;
  public idam_roles: string[];
  public up_idam_status: StaffUserIDAMStatus;
  public is_resend_invite?: boolean;

  public roles: {
    role_id: string,
    role: string,
    is_primary: boolean,
    created_time?: Date,
    last_updated_time?: Date,
  }[];

  public skills: {
    skill_id: number;
    description: string;
  }[];

  public services: {
    service: string;
    service_code: string;
  }[];

  public base_locations: StaffUserLocation[];

  public region: string;
  public region_id: number;

  public get primaryLocation() {
    return this.base_locations.find((item) => item.is_primary);
  }

  public get additionalLocations() {
    return this.base_locations.filter((item) => !item.is_primary);
  }

  public static from(json: any) {
    return Object.assign(new StaffUser(), json);
  }
}
