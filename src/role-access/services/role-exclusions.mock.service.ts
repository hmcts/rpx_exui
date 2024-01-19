import { Observable, of } from 'rxjs';
import { ExclusionStateData, Role } from '../models';
import { RoleExclusionsService } from './role-exclusions.service';

export class RoleExclusionsMockService extends RoleExclusionsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public confirmExclusion(exclusionStateData: ExclusionStateData): Observable<string> {
    return of('success');
  }

  public getRolesCategory(): Observable<Role[]> {
    return of([{ roleId: 'judicial', roleName: 'Judicial' }]);
  }
}
