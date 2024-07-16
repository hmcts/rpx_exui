import { Caseworker } from './interfaces/common';

export class FullUserDetailCache {
  // singleton class to keep single instance of role assignment query
  private static instance: FullUserDetailCache;
  private userDetails: Caseworker[];

  static getInstance(): FullUserDetailCache {
    this.instance = this.instance ? this.instance : new FullUserDetailCache();
    return this.instance;
  }

  setUserDetails(userDetails: Caseworker[]): void {
    this.userDetails = userDetails;
  }

  getAllUserDetails(): Caseworker[] {
    return this.userDetails;
  }
}
