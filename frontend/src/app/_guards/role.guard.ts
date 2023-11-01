import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanLoad, CanActivate } from '@angular/router';
import { StorageService } from '../_services/storage.service';
@Injectable()

export class RoleGuard implements CanActivate  {
    constructor(
      private router: Router,
      private storageService: StorageService) {
    }

    canActivate(): boolean {
        let isExpectedRole = false;
        isExpectedRole = this.storageService.getUser()["roles"].includes("ROLE_ADMIN");
        if (!isExpectedRole) {
          this.router.navigate(['/home'])
          //replace with something better thanks
          alert("This page does not exist for you!")
        }
        return isExpectedRole;
    }

}