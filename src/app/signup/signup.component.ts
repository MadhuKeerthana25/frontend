import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  role: string = '';
  password: string = '';

  private signupUrl = 'http://localhost:8080/auth/signup';

  constructor(private router: Router, private http: HttpClient, private alertService: AlertService,  private loaderService: LoaderService ) {}

  // onSignup() {
  //   // Retrieve existing users from local storage
  //   const users = JSON.parse(localStorage.getItem('users') || '[]');

  //   // Check if the username already exists
  //   if (users.some((u: any) => u.username === this.name)) {
  //     this.alertService.error('Username already exists');
  //     return;
  //   }

  //   // Add new user to the list
  //   users.push({ username: this.name, role: this.role, password: this.password });

  //   // Save updated user list to local storage
  //   localStorage.setItem('users', JSON.stringify(users));

  //   // Navigate to login page
  //   this.router.navigate(['/login']);
  // }

  onSignup() {
    const signupData = {
      username: this.name,
      password: this.password
    };

    this.loaderService.show(); // Show loader
    this.http.post(this.signupUrl, signupData).subscribe(
      (response) => {
        this.loaderService.hide(); // Hide loader
        this.alertService.success('Signup successful');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.loaderService.hide(); // Hide loader
        this.alertService.error('Signup failed: ' + error.message);
      }
    );
  }
}
