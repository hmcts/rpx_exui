export interface Assignee {
  id: string;
  userName: string;
}

export interface CaseData {
  category: string;
  location: LocationSummary;
  name: string;
  reference: string;
}

export interface LocationSummary {
  id: string;
  locationName: string;
}

export interface Location {
  id: string;
  locationName: string;
  services: string[];
}

export interface LocationApi {
  location_id: string;
  location: string;
  is_primary: boolean;
  services?: string[];
}

export interface CaseworkersByService {
  service: string;
  caseworkers: Caseworker[];
}

export interface Caseworker {
  firstName: string;
  lastName: string;
  idamId: string;
  email: string;
  location: Location;
  roleCategory: string;
  service?: string;
}

export interface CachedCaseworker {
  firstName: string;
  lastName: string;
  idamId: string;
  email: string;
  locations: Location[];
  roleCategory: string;
  services?: string[];
}

export interface Judicialworker {
  firstName: string;
  lastName: string;
  idamId: string;
  email: string;
  location: Location;
}

export interface CaseworkerApi {
  first_name: string;
  last_name: string;
  id: string;
  email_id: string;
  base_location: LocationApi[];
}

export interface Judicialworker {
  firstName: string;
  lastName: string;
  idamId: string;
  email: string;
  location: Location;
}

export interface Action {
  id: string;
  title: string;
}

export interface CaseDataType {
  [key: string]: {
    [key: string]: Set<string>;
  };
}
