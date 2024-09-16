// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Item } from './models/item.model';  // Adjust to your Item model path
// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ItemService {
//   private apiUrl = `${environment.apiBaseUrl}/items`;
//   private token = `${localStorage.getItem('token')}`;

//   constructor(private http: HttpClient) {}

//   getItems(): Observable<Item[]> {
//     return this.http.get<Item[]>(`${this.apiUrl}/getAllItems`, this.getHeaders());
//   }
  

//   getItemById(id: number): Observable<Item> {
//     return this.http.get<Item>(`${this.apiUrl}/getItemById/${id}`, this.getHeaders());
//   }

//   createItem(item: Item): Observable<Item> {
//     return this.http.post<Item>(`${this.apiUrl}/createItem`, item, this.getHeaders());
//   }

//   updateItem(id: number, item: Item): Observable<Item> {
//     return this.http.put<Item>(`${this.apiUrl}/updateItem/${id}`, item, this.getHeaders());
//   }

//   deleteItem(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/deleteItem/${id}`, this.getHeaders());
//   }

//   private getHeaders() {
//     return {
//       headers: new HttpHeaders({
//         'Authorization': `Bearer ${this.token}`,
//         'Content-Type': 'application/json',
//         // 'Access-Control-Allow-Origin': 'http://localhost:4200',
//         // 'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
//         // 'Access-Control-Allow-Headers' : 'Content-Type, Authorization'
//       }),
//     };
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './models/item.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = `${environment.apiBaseUrl}/items`;
  private token = localStorage.getItem('token') || '';

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/getAllItems`, this.getHeaders());
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/getItemById/${id}`, this.getHeaders());
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/createItem`, item, this.getHeaders());
  }

  updateItem(id: number, item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/updateItem/${id}`, item, this.getHeaders());
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteItem/${id}`, this.getHeaders());
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };
  }
}
