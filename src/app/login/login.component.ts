import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private alertService: AlertService) {}

  // onLogin() {
  //   // Retrieve user data from local storage
  //   const users = JSON.parse(localStorage.getItem('users') || '[]');

  //   // Find the user with the matching credentials
  //   const user = users.find((u: any) => u.username === this.username && u.password === this.password);

  //   if (user) { // Fix: Check if user is found
  //     this.authService.login(this.username, this.password);
  //     this.router.navigate(['/add-item']);
  //   } else {
  //     this.alertService.error('Invalid username or password');
  //   }
  // }

  onLogin() {
    // Call the login API via AuthService
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Navigate to add-item page after successful login
        this.router.navigate(['/add-item']);
      },
      (error) => {
        // Display an error message
        this.alertService.error('Invalid username or password');
      }
    );
  }
}





