// import { TestBed } from '@angular/core/testing';
// import { AuthService } from './auth.service';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [AuthService]
//     });

//     authService = TestBed.inject(AuthService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify(); // Verify that no unmatched requests are outstanding
//     localStorage.removeItem('token'); // Clean up token after each test
//   });

//   describe('getProfile', () => {
//     it('should retrieve profile when token is present in localStorage', () => {
//       const token = 'test-token';
//       const mockProfileData = { name: 'John Doe', email: 'john.doe@example.com' };
//       localStorage.setItem('token', token);

//       authService.getProfile().subscribe(profile => {
//         expect(profile).toEqual(mockProfileData);
//       });

//       const req = httpMock.expectOne(`${authService['apiUrl']}/profile`);
//       expect(req.request.method).toBe('GET');
//       expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
//       req.flush(mockProfileData);
//     });

//     it('should throw an error when token is not present in localStorage', () => {
//       localStorage.removeItem('token');

//       expect(() => authService.getProfile().subscribe()).toThrowError('User is not logged in');
//     });
//   });

//   describe('login', () => {
//     it('should store token and update tokenSubject on successful login', () => {
//       const username = 'testUser';
//       const password = 'testPass';
//       const mockResponse = { token: 'test-token' };

//       authService.login(username, password).subscribe(response => {
//         expect(response).toEqual(mockResponse);
//         expect(localStorage.getItem('token')).toBe('test-token');
//         expect(authService['tokenSubject'].value).toBe('test-token');
//       });

//       const req = httpMock.expectOne('http://localhost:8080/auth/login');
//       expect(req.request.method).toBe('POST');
//       expect(req.request.body).toEqual({ username, password });
//       req.flush(mockResponse);
//     });

//     it('should not update tokenSubject if no token is returned', () => {
//       const username = 'testUser';
//       const password = 'testPass';
//       const mockResponse = {};

//       authService.login(username, password).subscribe(response => {
//         expect(response).toEqual(mockResponse);
//         expect(localStorage.getItem('token')).toBeNull();
//         expect(authService['tokenSubject'].value).toBeNull();
//       });

//       const req = httpMock.expectOne('http://localhost:8080/auth/login');
//       expect(req.request.method).toBe('POST');
//       expect(req.request.body).toEqual({ username, password });
//       req.flush(mockResponse);
//     });

//     it('should handle error during login', () => {
//       const username = 'testUser';
//       const password = 'testPass';
//       const mockError = { status: 401, statusText: 'Unauthorized' };

//       authService.login(username, password).subscribe({
//         next: () => fail('Expected error, but got success'),
//         error: error => {
//           expect(error.status).toBe(401);
//           expect(localStorage.getItem('token')).toBeNull();
//           expect(authService['tokenSubject'].value).toBeNull();
//         }
//       });

//       const req = httpMock.expectOne('http://localhost:8080/auth/login');
//       expect(req.request.method).toBe('POST');
//       expect(req.request.body).toEqual({ username, password });
//       req.flush(null, mockError);
//     });
//   });

//   // New test cases to cover decodeToken method
//   describe('decodeToken', () => {
//     it('should decode a valid token and return the payload', () => {
//       const tokenPayload = { roles: ['USER'] };
//       const token = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;

//       const result = authService['decodeToken'](token);
//       expect(result).toEqual(tokenPayload);
//     });

//     it('should return null for an invalid token format', () => {
//       const invalidToken = 'invalid.token.format';

//       const result = authService['decodeToken'](invalidToken);
//       expect(result).toBeNull();
//     });

//     it('should return null and log an error if decoding fails', () => {
//       const invalidToken = 'header.invalidBase64.signature';
//       spyOn(console, 'error');

//       const result = authService['decodeToken'](invalidToken);
//       expect(result).toBeNull();
//       expect(console.error).toHaveBeenCalledWith('Error decoding token:', jasmine.any(Error));
//     });
//   });

//   // New test cases to cover getRoles method
//   describe('getRoles', () => {
//     it('should return roles from decoded token when token is present', () => {
//       const tokenPayload = { roles: ['USER', 'ADMIN'] };
//       const token = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;
//       authService['tokenSubject'].next(token);

//       const roles = authService.getRoles();
//       expect(roles).toEqual(['USER', 'ADMIN']);
//     });

//     it('should return an empty array if token is not present', () => {
//       authService['tokenSubject'].next(null);

//       const roles = authService.getRoles();
//       expect(roles).toEqual([]);
//     });

//     it('should return an empty array if decoded token has no roles', () => {
//       const tokenPayload = {}; // No roles in payload
//       const token = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;
//       authService['tokenSubject'].next(token);

//       const roles = authService.getRoles();
//       expect(roles).toEqual([]);
//     });
//   });
// });



import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
    localStorage.removeItem('token'); // Clean up token after each test
  });

  describe('getProfile', () => {
    it('should retrieve profile when token is present in localStorage', () => {
      const token = 'test-token';
      const mockProfileData = { name: 'John Doe', email: 'john.doe@example.com' };
      localStorage.setItem('token', token);

      authService.getProfile().subscribe(profile => {
        expect(profile).toEqual(mockProfileData);
      });

      const req = httpMock.expectOne(`${authService['apiUrl']}/profile`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(mockProfileData);
    });

    it('should throw an error when token is not present in localStorage', () => {
      localStorage.removeItem('token');

      expect(() => authService.getProfile().subscribe()).toThrowError('User is not logged in');
    });
  });

  describe('login', () => {
    it('should store token and update tokenSubject on successful login', () => {
      const username = 'testUser';
      const password = 'testPass';
      const mockResponse = { token: 'test-token' };

      authService.login(username, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBe('test-token');
        expect(authService['tokenSubject'].value).toBe('test-token');
      });

      const req = httpMock.expectOne('http://localhost:8080/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockResponse);
    });

    it('should not update tokenSubject if no token is returned', () => {
      const username = 'testUser';
      const password = 'testPass';
      const mockResponse = {};

      authService.login(username, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBeNull();
        expect(authService['tokenSubject'].value).toBeNull();
      });

      const req = httpMock.expectOne('http://localhost:8080/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockResponse);
    });

    it('should handle error during login', () => {
      const username = 'testUser';
      const password = 'testPass';
      const mockError = { status: 401, statusText: 'Unauthorized' };

      authService.login(username, password).subscribe({
        next: () => fail('Expected error, but got success'),
        error: error => {
          expect(error.status).toBe(401);
          expect(localStorage.getItem('token')).toBeNull();
          expect(authService['tokenSubject'].value).toBeNull();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(null, mockError);
    });
  });

  // New test cases to cover decodeToken method
  describe('decodeToken', () => {
    it('should decode a valid token and return the payload', () => {
      const tokenPayload = { roles: ['USER'] };
      const token = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;

      const result = authService['decodeToken'](token);
      expect(result).toEqual(tokenPayload);
    });

    it('should return null for an invalid token format', () => {
      const invalidToken = 'invalid.token.format';

      const result = authService['decodeToken'](invalidToken);
      expect(result).toBeNull();
    });

    it('should return null and log an error if decoding fails', () => {
      const invalidToken = 'header.invalidBase64.signature';
      spyOn(console, 'error');

      const result = authService['decodeToken'](invalidToken);
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error decoding token:', jasmine.any(Error));
    });
  });

  // New test cases to cover getRoles method
  describe('getRoles', () => {
    it('should return roles from decoded token when token is present', () => {
      const tokenPayload = { roles: ['USER', 'ADMIN'] };
      const token = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;
      authService['tokenSubject'].next(token);

      const roles = authService.getRoles();
      expect(roles).toEqual(['USER', 'ADMIN']);
    });

    it('should return an empty array if token is not present', () => {
      authService['tokenSubject'].next(null);

      const roles = authService.getRoles();
      expect(roles).toEqual([]);
    });

    it('should return an empty array if decoded token has no roles', () => {
      const tokenPayload = {}; // No roles in payload
      const token = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;
      authService['tokenSubject'].next(token);

      const roles = authService.getRoles();
      expect(roles).toEqual([]);
    });
  });

  // New test cases to cover logout method
  describe('logout', () => {
    it('should remove token from localStorage, reset tokenSubject, and log success on successful logout', () => {
      localStorage.setItem('token', 'test-token');
      authService['tokenSubject'].next('test-token');
      spyOn(console, 'log');

      authService.logout();

      const req = httpMock.expectOne('http://localhost:8080/auth/logout');
      expect(req.request.method).toBe('POST');
      req.flush({}); // Mock successful logout response

      expect(localStorage.getItem('token')).toBeNull();
      expect(authService['tokenSubject'].value).toBeNull();
      expect(console.log).toHaveBeenCalledWith('Logout successful, token revoked');
    });

    it('should handle error during logout, remove token locally, and reset tokenSubject', () => {
      localStorage.setItem('token', 'test-token');
      authService['tokenSubject'].next('test-token');
      spyOn(console, 'error');

      authService.logout();

      const req = httpMock.expectOne('http://localhost:8080/auth/logout');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(localStorage.getItem('token')).toBeNull();
      expect(authService['tokenSubject'].value).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error during logout:', jasmine.any(Object));
    });
  });
});
