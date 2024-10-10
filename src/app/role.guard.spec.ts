import { TestBed } from '@angular/core/testing';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    // Create mock instances for the services
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'hasAnyRole']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    alertServiceMock = jasmine.createSpyObj('AlertService', ['error']);

    // Set up the testing module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertService, useValue: alertServiceMock }
      ]
    });

    guard = TestBed.inject(RoleGuard); // Use TestBed to inject the guard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });


  it('should allow access if user is logged in and has the required roles', () => {
    const requiredRoles = ['ADMIN'];
    const route = {
      data: { roles: requiredRoles }
    } as unknown as ActivatedRouteSnapshot; // Type assertion to unknown first
    const state = {} as RouterStateSnapshot;
  
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.hasAnyRole.and.returnValue(true);
  
    const result = guard.canActivate(route, state);
  
    expect(result).toBeTrue();
  });
  

  it('should deny access if user does not have the required roles', () => {
    const requiredRoles = ['ADMIN'];
    const route = {
      data: { roles: requiredRoles }
    } as unknown as ActivatedRouteSnapshot; // Type assertion to unknown first
    const state = {} as RouterStateSnapshot;

    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.hasAnyRole.and.returnValue(false);

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(alertServiceMock.error).toHaveBeenCalledWith('You do not have required permissions to access this page');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Add more tests related to RoleGuard's functionality here
});
