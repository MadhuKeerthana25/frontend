import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createAdmin and return expected response on success', () => {
    const adminData = { username: 'testuser', password: 'password123', roles: ['ADMIN'] };
    const expectedResponse = { success: true };

    service.createAdmin(adminData).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/admin/createAdmin');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(expectedResponse); // Mock the response
  });

  it('should handle network error in createAdmin and return null', () => {
    const adminData = { username: 'testuser', password: 'password123', roles: ['ADMIN'] };

    service.createAdmin(adminData).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/admin/createAdmin');
    req.error(new ErrorEvent('Network error')); // Mock a network error
  });

  it('should handle unauthorized error in createAdmin and return null', () => {
    const adminData = { username: 'testuser', password: 'password123', roles: ['ADMIN'] };

    service.createAdmin(adminData).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/admin/createAdmin');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle other server errors in createAdmin and return null', () => {
    const adminData = { username: 'testuser', password: 'password123', roles: ['ADMIN'] };

    service.createAdmin(adminData).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/admin/createAdmin');
    req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });
  });
});