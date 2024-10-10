import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule

import { PhoneNumberService } from './phone-number.service';

describe('PhoneNumberService', () => {
  let service: PhoneNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Add HttpClientTestingModule here
    });
    service = TestBed.inject(PhoneNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
