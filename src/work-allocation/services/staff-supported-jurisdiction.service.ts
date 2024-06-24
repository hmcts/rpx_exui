import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class StaffSupportedJurisdictionsService {
  public static jurisdictionUrl: string = '/api/staff-supported-jurisdiction/get';
  public constructor(private readonly http: HttpClient) {}

  public getStaffSupportedJurisdictions(): Observable<string[]> {
    return this.http.get<string[]>(StaffSupportedJurisdictionsService.jurisdictionUrl);
  }
}
