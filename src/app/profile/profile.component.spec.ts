import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ProfileComponent } from './profile.component';
import { AuthService } from '../auth.service'; // Import the AuthService
import { of } from 'rxjs'; // Import of from rxjs

// Create a mock of the AuthService
class MockAuthService {
  isLoggedIn() {
    return true; // Simulate user is logged in
  }
  
  getProfile() {
    return of({ // Return an observable using of
      name: 'Test User',
      role: 'Admin',
    });
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [HttpClientModule], // Add HttpClientModule here
      providers: [
        { provide: AuthService, useClass: MockAuthService } // Use the mock service
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
