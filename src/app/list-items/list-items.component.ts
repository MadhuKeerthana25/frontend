
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ItemService } from '../item.service';
import { Item } from '../models/item.model';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {

  items: {id?: number; name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
  filteredItems: {id?: number; name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  ngOnInit(): void {
    this.loadItems();
  }

  constructor(private dataService: DataService, private router: Router, private itemService: ItemService) {}

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items.map(item => ({
        id: item.id,
        name: item.name,
        dob: item.dateOfBirth,
        gender: item.gender,
        email: item.emailId,
        phoneNumber: item.phoneNumbers.map(phoneNumber => phoneNumber.number)
      }));
      this.totalItems  = this.items.length; // Initially show all items
      this.updatePageItems();
    });
  }

  updatePageItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredItems = this.items.slice(start, end);
  }

  async editItem(index: number) {
    this.router.navigate(['/add-item'], { queryParams: { index } });
  }

  async deleteItem(index: number) {
    await this.dataService.deleteItem(index);
    this.itemService.getItems().subscribe(items => {
      this.items = items.map(item => ({
        id: item.id,
        name: item.name,
        dob: item.dateOfBirth,
        gender: item.gender,
        email: item.emailId,
        phoneNumber: item.phoneNumbers.map(phoneNumber => phoneNumber.number)
      }));
      // this.filterItems(); // Refresh the filtered list
      this.loadItems(); // Refresh the items list
    });
  }

  // filterItems() {
  //   this.filteredItems = this.items.filter(item => 
  //     item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     item.dob.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     item.gender.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     item.phoneNumber.some(phone => phone.toLowerCase().includes(this.searchTerm.toLowerCase()))
  //   );
  // }

  filterItems(): void {
    // Update filteredItems based on searchTerm and currentPage
    const filtered = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.dob.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.gender.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.phoneNumber.some(phone => phone.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.totalItems = filtered.length;
    this.items = filtered;
    this.updatePageItems();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePageItems();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

}


