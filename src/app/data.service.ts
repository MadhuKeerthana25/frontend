import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8080/items'; 

  private items: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];

  getItems(): Promise<{ name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[]> {
    return Promise.resolve(this.items);
  }

  private isEmailDuplicate(email: string, indexToExclude: number | null): boolean {
    return this.items.some((item, index) => item.email === email && index !== indexToExclude);
  }

  async addItem(item: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }): Promise<void> {
    if (this.isEmailDuplicate(item.email, null)) {
      throw new Error('An item with this email already exists.');
    }
    this.items.push(item);
    return Promise.resolve();
  }

  async updateItem(index: number, item: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }): Promise<void> {
    if (this.isEmailDuplicate(item.email, index)) {
      throw new Error('An item with this email already exists.');
    }
    this.items[index] = item;
    return Promise.resolve();
  }

  deleteItem(index: number): Promise<void> {
    this.items.splice(index, 1);
    return Promise.resolve();
  }
}

