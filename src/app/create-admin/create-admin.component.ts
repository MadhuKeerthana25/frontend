import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { UserService } from '../user.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent {
  username: string = '';
  password: string = '';
  roles: string[] = [];

  private createAdminUrl = 'http://localhost:8080/admin/createAdmin'; 

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    private userService: UserService,
    private loaderService: LoaderService 
  ) {}

  get rolesString(): string {
    return this.roles.join(', ');
  }

  set rolesString(value: string) {
    this.roles = value.split(',').map(role => role.trim());
  }

  onCreateAdmin() {
    this.loaderService.show(); 
    this.userService.isAdmin().pipe(
      tap(isAdmin => {
        if (!isAdmin) {
          this.alertService.error('Access denied. Only admins can create new admins.');
          throw new Error('Access denied');
        }
      }),
      switchMap(() => {
        const adminData = {
          username: this.username,
          password: this.password,
          roles: this.roles
        };
        return this.userService.createAdmin(adminData);
      }),
      tap(() => {
        this.alertService.success('Admin created successfully');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.alertService.error('Failed to create admin: ' + error.message);
        return of(null); // Returning an observable to complete the stream
      })
    ).subscribe({
      complete: () => this.loaderService.hide() 
    }); // No need to handle data here, it's already handled in tap
  }
}
