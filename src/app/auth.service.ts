import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/user';

  
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.http.get<any>(`${this.apiUrl}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      throw new Error('User is not logged in');
    }
  }
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.tokenSubject.next(token);
  }

  /**
   * Logs in the user by sending credentials to the backend.
   * On success, stores the token and updates the tokenSubject.
   * @param username - The user's username
   * @param password - The user's password
   * @returns An Observable with the login response
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/login', { username, password })
      .pipe(tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
        }
      }));
  }

  /**
   * Checks if the user is currently logged in.
   * @returns True if a token exists, false otherwise
   */
  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  /**
   * Decodes the JWT token to extract its payload.
   * @param token - The JWT token
   * @returns The decoded payload or null if decoding fails
   */
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

  /**
   * Retrieves the roles from the decoded JWT token.
   * @returns An array of roles or an empty array if none are found
   */
  getRoles(): string[] {
    const token = this.tokenSubject.value;
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.roles || []; // Extract roles from the decoded token
    }
    return [];
  }

  /**
   * Checks if the user has a specific role.
   * @param role - The role to check
   * @returns True if the user has the role, false otherwise
   */
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  /**
   * Checks if the user has any of the specified roles.
   * @param roles - An array of roles to check
   * @returns True if the user has at least one of the roles, false otherwise
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Logs out the user by revoking the token on the backend and clearing it from local storage.
   */
  logout(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Make POST request to revoke the token in the backend
      this.http.post('http://localhost:8080/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: () => {
          // Clear the token from local storage and behavior subject on successful logout
          localStorage.removeItem('token');
          this.tokenSubject.next(null);
          console.log('Logout successful, token revoked');
        },
        error: (err) => {
          console.error('Error during logout:', err);
          // Optionally, you can still remove the token locally even if backend fails
          localStorage.removeItem('token');
          this.tokenSubject.next(null);
        }
      });
    } else {
      console.warn('No token found for logout');
    }
  }
}
