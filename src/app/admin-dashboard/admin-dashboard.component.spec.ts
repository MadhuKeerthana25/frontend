// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

// import { AdminDashboardComponent } from './admin-dashboard.component';

// describe('AdminDashboardComponent', () => {
//   let component: AdminDashboardComponent;
//   let fixture: ComponentFixture<AdminDashboardComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AdminDashboardComponent],
//       imports: [HttpClientModule] // Add HttpClientModule here
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AdminDashboardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../auth.service'; // Import AuthService
import { AdminDashboardComponent } from './admin-dashboard.component';

class MockAuthService {
  hasRole(role: string): boolean {
    return role === 'ADMIN'; // Default to returning true for 'ADMIN'
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authService: AuthService; // Declare AuthService
  let router: Router; // Declare Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService }, // Use MockAuthService
        { provide: Router, useClass: MockRouter } // Use MockRouter
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService); // Inject AuthService
    router = TestBed.inject(Router); // Inject Router
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to Create Admin page if user has ADMIN role', () => {
    spyOn(authService, 'hasRole').and.returnValue(true); // Simulate ADMIN role
    spyOn(router, 'navigate'); // Spy on the navigate method

    component.navigateToCreateAdmin(); // Call the method

    expect(authService.hasRole).toHaveBeenCalledWith('ADMIN'); // Ensure hasRole was called with 'ADMIN'
    expect(router.navigate).toHaveBeenCalledWith(['/create-admin']); // Ensure navigation occurred
  });

  it('should not navigate to Create Admin page if user does not have ADMIN role', () => {
    spyOn(authService, 'hasRole').and.returnValue(false); // Simulate no ADMIN role
    spyOn(console, 'error'); // Spy on console.error

    component.navigateToCreateAdmin(); // Call the method

    expect(authService.hasRole).toHaveBeenCalledWith('ADMIN'); // Ensure hasRole was called with 'ADMIN'
    expect(console.error).toHaveBeenCalledWith('Access denied. You do not have the required permissions.'); // Check console error message
  });
});
