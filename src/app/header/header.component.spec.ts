import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Import this for ignoring unknown properties

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    // Create a mock AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getProfile']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, ProfileModalComponent], // Use the real ProfileModalComponent
      imports: [
        HttpClientModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService } // Provide the mock AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown properties in tests
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the profile modal and load profile data on success', () => {
    // Arrange: mock a successful response from getProfile()
    const mockProfileData = { name: 'John Doe', email: 'john@example.com' };
    mockAuthService.getProfile.and.returnValue(of(mockProfileData));

    // Act: trigger the openProfile method
    component.openProfile();
    fixture.detectChanges(); // Update the DOM after state change

    // Assert: Check that the modal is opened and profile data is set correctly
    expect(component.isProfileModalVisible).toBeTrue();
    expect(component.profileModalComponent.userDetails).toEqual(mockProfileData);
    expect(mockAuthService.getProfile).toHaveBeenCalled();
  });

  it('should log an error and not set profile data if getProfile() fails', () => {
    // Arrange: mock a failed response from getProfile()
    const mockError = new Error('Failed to load profile');
    spyOn(console, 'error'); // Spy on console.error
    mockAuthService.getProfile.and.returnValue(throwError(mockError));

    // Act: trigger the openProfile method
    component.openProfile();
    fixture.detectChanges(); // Update the DOM after state change

    // Assert: Check that the modal is opened but no profile data is set
    expect(component.isProfileModalVisible).toBeTrue();
    expect(component.profileModalComponent.userDetails).toBeUndefined();
    expect(mockAuthService.getProfile).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching profile data', mockError);
  });

  it('should close the profile modal', () => {
    // Act: Trigger the closeProfileModal method
    component.closeProfileModal();
    fixture.detectChanges(); // Update the DOM after state change

    // Assert: Check that the modal is hidden
    expect(component.isProfileModalVisible).toBeFalse();
  });
});
