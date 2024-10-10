import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { FormsModule } from '@angular/forms'; // Import FormsModule or ReactiveFormsModule

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service'; // Make sure to import AuthService if used

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule here
        FormsModule // Add FormsModule or ReactiveFormsModule here
      ],
      providers: [AuthService] // Optionally provide AuthService if not provided elsewhere
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
