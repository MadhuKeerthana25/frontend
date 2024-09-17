import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.logout();  
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login page after logout
  }
}
