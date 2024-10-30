import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `http://localhost:8080/admin/createAdmin`; // Adjust as needed
  private token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  createAdmin(adminData: { username: string; password: string; roles: string[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, adminData, this.getHeaders())
      .pipe(
        catchError(error => {
          console.error('Error creating admin', error);
          return of(null); // Return an observable with null value
        })
      );
  }

  getUserRole(): Observable<string[]> {
    // Assume the token is a JWT and extract roles from it
    const token = this.token;
    if (!token) return of([]);

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    return of(payload.roles || []);
  }

  isAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(
      map(roles => roles.includes('ADMIN'))
    );
  }
}


