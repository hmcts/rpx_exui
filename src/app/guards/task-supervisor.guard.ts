import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../models';
import { SessionStorageService } from '../services';

@Injectable({
  providedIn: 'root'
})

export class TaskSupervisorGuard {
  constructor(private readonly sessionStorageService: SessionStorageService,
                private readonly router: Router) {}

  public canActivate(): boolean {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr) {
      const userInfo: UserInfo = JSON.parse(userInfoStr);
      const roleExists = userInfo?.roles.includes('task-supervisor');
      if (!roleExists) {
        this.router.navigateByUrl('/cases');
      }
      return roleExists;
    }
    return false;
  }
}
