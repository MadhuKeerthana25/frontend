
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { DataService } from '../data.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ItemService } from '../item.service';
// import { subscribe } from 'diagnostics_channel';

// @Component({
//   selector: 'app-list-items',
//   templateUrl: './list-items.component.html',
//   styleUrls: ['./list-items.component.css']
// })
// export class ListItemsComponent implements OnInit {

//   items: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
//   filteredItems: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
//   searchTerm: string = '';

//   constructor(private dataService: DataService, private router: Router, private itemService: ItemService) {}


//   async ngOnInit(): Promise<void> {
//     // this.items = await this.dataService.getItems();
//     await this.itemService.getItems().subscribe(items => {
//       // this.items = items;
//       this.items = items.map(item => ({
//         name: item.name,
//         dob: item.dateOfBirth,
//         gender: item.gender,
//         email: item.emailId,
//         phoneNumber: item.phoneNumbers.map(itemNumber => itemNumber.number)
//       }))
//     });
//    this.filteredItems = this.items; // Initially show all items
//   }

//   async editItem(index: number) {
//     this.router.navigate(['/add-item'], { queryParams: { index } });
//   }

//   async deleteItem(index: number) {
//     await this.dataService.deleteItem(index);
//     this.items = await this.dataService.getItems();
//     this.filterItems(); // Refresh the filtered list
//   }

//   filterItems() {
//     this.filteredItems = this.items.filter(item => 
//       item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//       item.dob.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//       item.gender.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//       item.phoneNumber.some(phone => phone.toLowerCase().includes(this.searchTerm.toLowerCase()))
//     );
//   }
// }


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

  items: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
  filteredItems: { name: string; dob: string; gender: string; email: string; phoneNumber: string[] }[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router, private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items.map(item => ({
        name: item.name,
        dob: item.dateOfBirth,
        gender: item.gender,
        email: item.emailId,
        phoneNumber: item.phoneNumbers.map(phoneNumber => phoneNumber.number)
      }));
      this.filteredItems = this.items; // Initially show all items
    });
  }

  async editItem(index: number) {
    this.router.navigate(['/add-item'], { queryParams: { index } });
  }

  async deleteItem(index: number) {
    await this.dataService.deleteItem(index);
    this.itemService.getItems().subscribe(items => {
      this.items = items.map(item => ({
        name: item.name,
        dob: item.dateOfBirth,
        gender: item.gender,
        email: item.emailId,
        phoneNumber: item.phoneNumbers.map(phoneNumber => phoneNumber.number)
      }));
      this.filterItems(); // Refresh the filtered list
    });
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
