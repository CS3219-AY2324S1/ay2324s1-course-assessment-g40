import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../_services/storage.service';

@Injectable()
export class AuthGuard  implements CanActivate {
    constructor(private storageService: StorageService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkIsLogin();
    }

    checkIsLogin(): boolean {
        if (this.storageService.isLoggedin()) {
            return true
        }
        // Navigate to the login page with extras
        var err = "Please login!"
        this.router.navigate(['/login'], {queryParams: {err: "Please login!"}})
        return false
    }
}