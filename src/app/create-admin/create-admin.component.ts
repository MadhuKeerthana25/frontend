import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent {
  username: string = '';
  password: string = '';
  roles: string[] = [];

  private createAdminUrl = 'http://localhost:8080/admin/createAdmin'; // Adjust URL as needed

  constructor(private router: Router, private http: HttpClient, private alertService: AlertService) {}

  // Getter to convert roles array to a comma-separated string for display/input
  get rolesString(): string {
    return this.roles.join(', ');
  }

  // Setter to convert comma-separated string input to roles array
  set rolesString(value: string) {
    this.roles = value.split(',').map(role => role.trim());
  }

  onCreateAdmin() {
    const adminData = {
      username: this.username,
      password: this.password,
      roles: this.roles
    };

    this.http.post(this.createAdminUrl, adminData).subscribe(
      (response) => {
        this.alertService.success('Admin created successfully');
        this.router.navigate(['/login']); // Adjust navigation as needed
      },
      (error) => {
        this.alertService.error('Failed to create admin: ' + error.message);
      }
    );
  }
}
