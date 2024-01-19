import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionStorageService } from '../../app/services';

@Injectable({
  providedIn: 'root'
})
export class TaskTypesService {
  public static typesOfWorkStorageKey: string = 'typesOfWork_cache';
  public constructor(private readonly http: HttpClient, private readonly sessionStorage: SessionStorageService) { }

  public getTypesOfWork(): Observable<any[]> {
    if (this.sessionStorage.getItem(TaskTypesService.typesOfWorkStorageKey)) {
      const typesOfWork = JSON.parse(this.sessionStorage.getItem(TaskTypesService.typesOfWorkStorageKey));
      return of(typesOfWork);
    }
    return this.http.get<any[]>('/workallocation/task/types-of-work')
      .pipe(
        tap((typesOfWork: any[]) => this.sessionStorage.setItem(TaskTypesService.typesOfWorkStorageKey, JSON.stringify(typesOfWork)))
      );
  }
}
