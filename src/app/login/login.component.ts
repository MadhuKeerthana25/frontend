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

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        console.log('Login successful');
        // Redirect to the add-item page upon successful login
        this.router.navigate(['/add-item', '/list-item']);
      },
      (error) => {
        console.error('Login failed', error);
        // Display an error message
        this.alertService.error('Invalid username or password');
      }
    );
    
  }
}
