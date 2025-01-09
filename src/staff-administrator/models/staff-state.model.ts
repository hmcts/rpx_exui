import { StaffUserResponseError } from './staff-user-response-error.model';

export interface StaffState {
    staffGetError: null | StaffUserResponseError;
}
