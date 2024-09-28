import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8080/items'; 

  private items: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];

  private itemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  items$: Observable<any[]> = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Fetch initial data
    this.fetchItems();
  }

  // Fetch all items from the backend
  private fetchItems() {
    this.http.get<{ name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[]>(`${this.apiUrl}/getAllItems`)
      .pipe(
        tap(items => this.itemsSubject.next(items)),
        catchError(error => {
          console.error('Error fetching items', error);
          return [];
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  // Get all items with Observable
  getItems(): Observable<{ id: string; name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[]> {
    return this.http.get<{ id: string; name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[]>(`${this.apiUrl}/getAllItems`);
  }
  
  // Check for duplicate email when adding/updating an item
  private isEmailDuplicate(email: string, indexToExclude: number | null): boolean {
    return this.items.some((item, index) => item.email === email && index !== indexToExclude);
  }

  // Add a new item
  addItem(item: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/createItem`, item)
      .pipe(
        tap(() => this.fetchItems()), // Refresh the items list
        catchError(error => {
          console.error('Error adding item', error);
          return [];
        })
      );
  }

  // Update an existing item
  async updateItem(index: number, item: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }): Promise<void> {
    if (this.isEmailDuplicate(item.email, index)) {
      throw new Error('An item with this email already exists.');
    }
    this.items[index] = item;
    return Promise.resolve();
  }


  // Delete a single item
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteItem/${id}`, {
      headers: this.getHeaders().headers,
      observe: 'response' // This option allows us to observe the entire response.
    }).pipe(
      tap(() => this.fetchItems()), // Refresh the items list
      catchError(error => {
        console.error('Error deleting item', error);
        return of(); // Return an observable with a void value
      }),
      map(() => {}) // Map the response to void
    );
  }


deleteItemsInBulk(ids: number[]): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteItems`, {
      headers: this.getHeaders().headers,
      body: ids // Send IDs in the request body
  }).pipe(
      tap(() => this.fetchItems()), // Refresh the items list after deletion
      catchError(error => {
          console.error('Error deleting items in bulk', error);
          return of();
      })
  );
}

  

  // Helper to retrieve headers including the Authorization token
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  // Ensure Content-Type is set correctly
      })
    };
  }
}
