import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(private router: Router, private authService: AuthService) {}

  // Method to navigate to the Create Admin page
  navigateToCreateAdmin() {
    if (this.authService.hasRole('ADMIN')) {
      this.router.navigate(['/create-admin']);
    } else {
      console.error('Access denied. You do not have the required permissions.');
    }
  }
}
