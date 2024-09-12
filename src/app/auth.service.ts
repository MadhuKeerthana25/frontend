// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// // import jwt_decode from "jwt-decode";
// import jwtDecode, { JwtPayload } from 'jwt-decode';




// export interface LoginResponse {
//   token: string;
//   roles: string[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private loginUrl = 'http://localhost:8080/auth/login'; // Backend URL

//   constructor(private http: HttpClient) {}

//   // Login API call to the backend
//   login(username: string, password: string): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(this.loginUrl, { username, password }).pipe(
//       tap(response => {
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('roles', JSON.stringify(response.roles));
//       })
//     );
//   }

//   decodeToken(token: string): any {
//     const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
//     return decodedToken;
//   }

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('roles');
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   hasRole(role: string): boolean {
//     const roles = JSON.parse(localStorage.getItem('roles') || '[]');
//     return roles.includes(role);
//   }

//   hasAnyRole(requiredRoles: string[]): boolean {
//     const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
//     return requiredRoles.some(role => userRoles.includes(role));
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/auth/login'; // Backend URL

  constructor(private http: HttpClient) {}

  // Login API call to the backend
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('roles', JSON.stringify(this.extractRolesFromToken(response.token)));
      })
    );
  }

  // Manually decode the JWT token to extract the roles
  decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1]; // Extract the payload part (second section of the JWT)
      const decodedPayload = atob(payloadBase64); // Decode from Base64
      return JSON.parse(decodedPayload); // Parse the JSON object
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Extract roles from the decoded token
  extractRolesFromToken(token: string): string[] {
    const decodedToken = this.decodeToken(token);
    return decodedToken?.roles || []; // Return roles or an empty array if not found
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.includes(role);
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    return requiredRoles.some(role => userRoles.includes(role));
  }
}


