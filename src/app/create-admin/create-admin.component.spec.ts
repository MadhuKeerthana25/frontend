import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for form support
import { of, throwError } from 'rxjs'; // Import RxJS for observables

import { CreateAdminComponent } from './create-admin.component';
import { UserService } from '../user.service'; // Import UserService
import { AlertService } from '../alert.service'; // Import AlertService
import { LoaderService } from '../loader.service'; // Import LoaderService

describe('CreateAdminComponent', () => {
  let component: CreateAdminComponent;
  let fixture: ComponentFixture<CreateAdminComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;
  let loaderServiceMock: jasmine.SpyObj<LoaderService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['isAdmin', 'createAdmin']);
    alertServiceMock = jasmine.createSpyObj('AlertService', ['error', 'success']);
    loaderServiceMock = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [CreateAdminComponent],
      imports: [
        HttpClientModule, // Add HttpClientModule here
        FormsModule // Add FormsModule to support template-driven forms
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set roles from rolesString', () => {
    const testRolesString = 'Admin, User, Manager';
    component.rolesString = testRolesString;

    expect(component.roles).toEqual(['Admin', 'User', 'Manager']);
  });

  it('should trim whitespace from roles', () => {
    const testRolesString = 'Admin,   User,Manager';
    component.rolesString = testRolesString;

    expect(component.roles).toEqual(['Admin', 'User', 'Manager']);
  });

  it('should show loader and call isAdmin on createAdmin', () => {
    userServiceMock.isAdmin.and.returnValue(of(true)); // Mocking isAdmin to return true
    component.onCreateAdmin();
    
    expect(loaderServiceMock.show).toHaveBeenCalled(); // Check if loader is shown
    expect(userServiceMock.isAdmin).toHaveBeenCalled(); // Check if isAdmin was called
  });

  it('should handle access denied when isAdmin returns false', () => {
    userServiceMock.isAdmin.and.returnValue(of(false)); // Mocking isAdmin to return false
    component.onCreateAdmin();
    
    expect(loaderServiceMock.show).toHaveBeenCalled(); // Check if loader is shown
    expect(alertServiceMock.error).toHaveBeenCalledWith('Access denied. Only admins can create new admins.'); // Check if access denied alert was called
    expect(loaderServiceMock.hide).toHaveBeenCalled(); // Ensure loader is hidden afterwards
  });

  it('should call createAdmin when isAdmin returns true', () => {
    userServiceMock.isAdmin.and.returnValue(of(true)); // Mocking isAdmin to return true
    userServiceMock.createAdmin.and.returnValue(of(null)); // Mocking createAdmin to simulate successful admin creation

    component.username = 'testuser';
    component.password = 'testpassword';
    component.rolesString = 'Admin';

    component.onCreateAdmin();
    
    expect(loaderServiceMock.show).toHaveBeenCalled(); // Check if loader is shown
    expect(userServiceMock.createAdmin).toHaveBeenCalledWith({
      username: component.username,
      password: component.password,
      roles: component.roles
    }); // Check if createAdmin was called with correct data
    expect(alertServiceMock.success).toHaveBeenCalledWith('Admin created successfully'); // Check success alert
    expect(loaderServiceMock.hide).toHaveBeenCalled(); // Ensure loader is hidden afterwards
  });

  it('should handle error when createAdmin fails', () => {
    userServiceMock.isAdmin.and.returnValue(of(true)); // Mocking isAdmin to return true
    userServiceMock.createAdmin.and.returnValue(throwError({ message: 'Server error' })); // Simulate an error from createAdmin

    component.onCreateAdmin();

    expect(loaderServiceMock.show).toHaveBeenCalled(); // Check if loader is shown
    expect(alertServiceMock.error).toHaveBeenCalledWith('Failed to create admin: Server error'); // Check error alert
    expect(loaderServiceMock.hide).toHaveBeenCalled(); // Ensure loader is hidden afterwards
  });
});
