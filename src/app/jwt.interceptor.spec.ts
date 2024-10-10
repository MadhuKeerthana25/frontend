import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;

  beforeEach(() => {
    interceptor = new JwtInterceptor();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  // Add more tests related to JwtInterceptor's functionality here
});
