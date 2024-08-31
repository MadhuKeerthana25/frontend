
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {

  items: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
  filteredItems: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) {}


  async ngOnInit(): Promise<void> {
    this.items = await this.dataService.getItems();
    this.filteredItems = this.items; // Initially show all items
  }

  async editItem(index: number) {
    this.router.navigate(['/add-item'], { queryParams: { index } });
  }

  async deleteItem(index: number) {
    await this.dataService.deleteItem(index);
    this.items = await this.dataService.getItems();
    this.filterItems(); // Refresh the filtered list
  }

  filterItems() {
    this.filteredItems = this.items.filter(item => 
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.dob.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.gender.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.phoneNumber.some(phone => phone.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}

