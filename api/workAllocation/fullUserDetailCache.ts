import { CachedCaseworker } from './interfaces/common';

export class FullUserDetailCache {
  // singleton class to keep single instance of role assignment query
  private static instance: FullUserDetailCache;
  private userDetails: CachedCaseworker[];

  private static getInstance(): FullUserDetailCache {
    this.instance = this.instance ? this.instance : new FullUserDetailCache();
    return this.instance;
  }

  static setUserDetails(userDetails: CachedCaseworker[]): void {
    const instance = this.getInstance();
    instance.userDetails = userDetails;
  }

  static getAllUserDetails(): CachedCaseworker[] {
    const instance = this.getInstance();
    return instance.userDetails;
  }
}
