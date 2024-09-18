
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles = route.data['roles'] as string[];
    if (this.authService.isLoggedIn() && this.authService.hasAnyRole(requiredRoles)) {
      return true;
    } else {
      this.alertService.error('You do not have required permissions to access this page');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
