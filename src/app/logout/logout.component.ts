import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; 
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.logout();
  }

  logout(): void {
    this.loaderService.show(); // Show loader
    this.authService.logout();
    this.loaderService.hide(); // Hide loader
    this.router.navigate(['/login']);
  }
}
