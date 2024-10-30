import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service'; // Update with the correct path if necessary
import { Router } from '@angular/router'; // Ensure this import is correct

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create mocks for AuthService and Router
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Provide the mock implementations in the TestBed configuration
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    // Instantiate the AuthGuard with the mocked dependencies
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when the user is logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(true); // User is logged in
    const result = guard.canActivate();
    expect(result).toBeTrue(); // Expect true to be returned
    expect(routerMock.navigate).not.toHaveBeenCalled(); // Router navigate should not be called
  });

  it('should deny access and navigate to login when the user is not logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(false); // User is not logged in
    const result = guard.canActivate();
    expect(result).toBeFalse(); // Expect false to be returned
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']); // Router should navigate to '/login'
  });
});
