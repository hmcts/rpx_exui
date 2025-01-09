import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDetails } from '../../../app/models/user-details.model';

// TODO: Write unit tests
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  public getUserDetails(refreshRoleAssignments: boolean=false): Observable<UserDetails> {
    return this.http.get<UserDetails>(`api/user/details?refreshRoleAssignments=${refreshRoleAssignments}`);
  }
}
