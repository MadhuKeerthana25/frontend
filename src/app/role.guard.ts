// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean {
//     const requiredRoles = route.data['roles'] as string[]; // Expect an array of roles
//     console.log(requiredRoles);
//     if (this.authService.isLoggedIn() && this.authService.hasAnyRole(requiredRoles)) {
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles = route.data['roles'] as string[];
    if (this.authService.isLoggedIn() && this.authService.hasAnyRole(requiredRoles)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
