import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JudicialUserModel } from '../models/judicialUser.model';

@Injectable({ providedIn: 'root' })
export class JudicialRefDataService {
  public constructor(private readonly http: HttpClient) {}

  public searchJudicialUserByPersonalCodes(personalCodes: string[]): Observable<JudicialUserModel[]> {
    return this.http.post<JudicialUserModel[]>('api/prd/judicial/searchJudicialUserByPersonalCodes',
      { personal_code: personalCodes });
  }

  public searchJudicialUserByIdamID(idamIds: string[]): Observable<JudicialUserModel[]> {
    return this.http.post<JudicialUserModel[]>('api/prd/judicial/searchJudicialUserByIdamId',
      { sidam_ids: idamIds });
  }
}
