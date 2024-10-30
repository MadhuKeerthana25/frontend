// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
// import { FormsModule } from '@angular/forms'; // Import FormsModule or ReactiveFormsModule

// import { LoginComponent } from './login.component';
// import { AuthService } from '../auth.service'; // Make sure to import AuthService if used

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [LoginComponent],
//       imports: [
//         HttpClientTestingModule, // Add HttpClientTestingModule here
//         FormsModule // Add FormsModule or ReactiveFormsModule here
//       ],
//       providers: [AuthService] // Optionally provide AuthService if not provided elsewhere
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { FormsModule } from '@angular/forms'; // Import FormsModule or ReactiveFormsModule
import { Router } from '@angular/router'; // Import Router
import { of, throwError } from 'rxjs'; // To mock observables

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service'; // Make sure to import AuthService if used
import { AlertService } from '../alert.service'; // Import AlertService
import { LoaderService } from '../loader.service'; // Import LoaderService

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let alertServiceMock: any;
  let loaderServiceMock: any;

  beforeEach(async () => {
    // Create mock services
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'hasRole']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    alertServiceMock = jasmine.createSpyObj('AlertService', ['error']);
    loaderServiceMock = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule here
        FormsModule // Add FormsModule or ReactiveFormsModule here
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }, // Use the mock AuthService
        { provide: Router, useValue: routerMock }, // Use the mock Router
        { provide: AlertService, useValue: alertServiceMock }, // Use the mock AlertService
        { provide: LoaderService, useValue: loaderServiceMock } // Use the mock LoaderService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLogin', () => {
    it('should show loader, login successfully as ADMIN, hide loader, and navigate to /add-item', () => {
      // Arrange
      authServiceMock.login.and.returnValue(of({})); // Simulate a successful login response
      authServiceMock.hasRole.and.callFake((role: string) => role === 'ADMIN'); // Simulate hasRole method returning ADMIN

      // Act
      component.onLogin();

      // Assert
      expect(loaderServiceMock.show).toHaveBeenCalled(); // Loader should show
      expect(authServiceMock.login).toHaveBeenCalledWith(component.username, component.password); // Login should be called
      expect(loaderServiceMock.hide).toHaveBeenCalled(); // Loader should hide
      expect(routerMock.navigate).toHaveBeenCalledWith(['/add-item']); // Should navigate to /add-item
    });

    it('should show loader, login successfully as USER, hide loader, and navigate to /list-items', () => {
      // Arrange
      authServiceMock.login.and.returnValue(of({})); // Simulate a successful login response
      authServiceMock.hasRole.and.callFake((role: string) => role === 'USER'); // Simulate hasRole method returning USER

      // Act
      component.onLogin();

      // Assert
      expect(loaderServiceMock.show).toHaveBeenCalled(); // Loader should show
      expect(authServiceMock.login).toHaveBeenCalledWith(component.username, component.password); // Login should be called
      expect(loaderServiceMock.hide).toHaveBeenCalled(); // Loader should hide
      expect(routerMock.navigate).toHaveBeenCalledWith(['/list-items']); // Should navigate to /list-items
    });

    it('should show loader, login fail, hide loader, and show error alert', () => {
      // Arrange
      const errorResponse = { message: 'Login failed' };
      authServiceMock.login.and.returnValue(throwError(errorResponse)); // Simulate a failed login response

      // Act
      component.onLogin();

      // Assert
      expect(loaderServiceMock.show).toHaveBeenCalled(); // Loader should show
      expect(authServiceMock.login).toHaveBeenCalledWith(component.username, component.password); // Login should be called
      expect(loaderServiceMock.hide).toHaveBeenCalled(); // Loader should hide
      expect(alertServiceMock.error).toHaveBeenCalledWith('Invalid username or password'); // Should show error alert
    });
  });
});
