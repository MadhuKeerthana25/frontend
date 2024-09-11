import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string; // Assuming the backend returns a JWT token in the 'token' field
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:8080/auth/login'; // Backend login URL
  // private isAuthenticated = false;

  // login(username: string, password: string): boolean {
  //   const users = JSON.parse(localStorage.getItem('users') || '[]');
  //   const user = users.find((u: any) => u.username === username && u.password === password);
  //   if (user) {
  //     this.isAuthenticated = true;
  //     return true;
  //   }
  //   return false;
  // }

  // logout(): void {
  //   this.isAuthenticated = false;
  // }

  // isLoggedIn(): boolean {
  //   return this.isAuthenticated;
  // }

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password }).pipe(
      tap(response => {
        // Save the token to localStorage or sessionStorage
        localStorage.setItem('token', response.token); // TypeScript now knows 'token' exists
        localStorage.setItem('role', response.role); 
      })
    );
  }
  logout() {
    // Remove the token on logout
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
