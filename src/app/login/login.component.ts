import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private alertService: AlertService, private loaderService: LoaderService) {}


  onLogin() {
    this.loaderService.show(); // Show loader
    this.authService.login(this.username, this.password).subscribe(
        () => {
            this.loaderService.hide(); // Hide loader after login
            if (this.authService.hasRole('ADMIN')) {
                this.router.navigate(['/add-item']);
                console.log('Login successful');
            } else if (this.authService.hasRole('USER')) {
                this.router.navigate(['/list-items']);
                console.log('Login successful');
            }
        },
        (error) => {
            this.loaderService.hide(); // Hide loader on error
            console.error('Login failed', error);
            this.alertService.error('Invalid username or password');
        }
    );
}
  
}

