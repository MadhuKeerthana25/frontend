import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.tokenSubject.next(token);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/login', { username, password })
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      }));
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  // Manual JWT decoding (no external library needed)
  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1]; // Get the payload part (the second section of the JWT)
      const decodedPayload = atob(payloadBase64); // Decode from Base64 to a string
      return JSON.parse(decodedPayload); // Parse the decoded string into a JSON object
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRoles(): string[] {
    const token = this.tokenSubject.value;
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.roles || []; // Extract roles from the decoded token
    }
    return [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}
