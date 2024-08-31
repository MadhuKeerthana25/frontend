import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhoneNumber } from './models/phone-number.model';  // Adjust to your PhoneNumber model path
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhoneNumberService {
  private apiUrl = `${environment.apiBaseUrl}/phoneNumbers`;

  constructor(private http: HttpClient) {}

  createPhoneNumber(phoneNumber: PhoneNumber): Observable<PhoneNumber> {
    return this.http.post<PhoneNumber>(`${this.apiUrl}/createPhoneNumber`, phoneNumber, this.getHeaders());
  }

  deletePhoneNumber(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletePhoneNumber/${id}`, this.getHeaders());
  }
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
}
