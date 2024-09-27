import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {

  items: { id?: number; name: string; dob: string; gender: string; email: string; phoneNumber: string[]; selected?: boolean }[] = [];
  filteredItems: { id?: number; name: string; dob: string; gender: string; email: string; phoneNumber: string[]; selected?: boolean }[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  selectedItems: number[] = []; // Array to store selected item IDs

  constructor(private dataService: DataService, private router: Router, private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items.map(item => ({
        id: item.id,
        name: item.name,
        dob: item.dateOfBirth,
        gender: item.gender,
        email: item.emailId,
        phoneNumber: item.phoneNumbers.map(phoneNumber => phoneNumber.number),
        selected: false // Initialize the selected property
      }));
      this.totalItems = this.items.length;
      this.updatePageItems();
    });
  }

  updatePageItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredItems = this.items.slice(start, end);
  }

  editItem(id: number): void {
    this.router.navigate(['/add-item'], { queryParams: { id } });
  }

  deleteItem(id: number): void {
    this.dataService.deleteItem(id).subscribe(() => {
      console.log(`Item with id ${id} deleted.`);
      this.loadItems(); // Reload items after deletion
    });
  }

  // Toggle select all
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.filteredItems.forEach(item => item.selected = checked);
    this.selectedItems = checked ? this.filteredItems.map(item => item.id as number) : [];
  }

  // When an individual item is selected/deselected
  onItemSelect(item: any): void {
    if (item.selected) {
      this.selectedItems.push(item.id as number);
    } else {
      this.selectedItems = this.selectedItems.filter(id => id !== item.id);
    }
  }

  // Delete selected items in bulk
  deleteSelectedItems(): void {
    if (this.selectedItems.length > 0) {
      this.dataService.deleteItemsInBulk(this.selectedItems).subscribe({
        next: () => {
          console.log('Selected items deleted:', this.selectedItems);
          this.selectedItems = []; // Clear the selected items array after deletion
          this.loadItems(); // Reload items after deletion
        },
        error: (error) => {
          console.error('Error deleting selected items:', error);
        }
      });
    } else {
      console.log('No items selected for deletion');
    }
  }

  filterItems(): void {
    const filtered = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.dob.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.gender.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.phoneNumber.some(phone => phone.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.totalItems = filtered.length;
    this.filteredItems = filtered;
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
