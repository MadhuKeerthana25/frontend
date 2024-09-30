// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';
// import { LoaderService } from '../loader.service';

// @Component({
//   selector: 'app-list-items',
//   templateUrl: './list-items.component.html',
//   styleUrls: ['./list-items.component.css']
// })
// export class ListItemsComponent implements OnInit {
//   items: Item[] = [];
//   filteredItems: Item[] = [];
//   searchTerm: string = '';
//   currentPage: number = 1;
//   itemsPerPage: number = 5;
//   totalItems: number = 0;
//   selectedItems: number[] = []; // Array to store selected item IDs

//   constructor(
//     private dataService: DataService,
//     private router: Router,
//     private itemService: ItemService,
//     private loaderService: LoaderService 
//   ) {}

//   ngOnInit(): void {
//     this.loadItems();
//   }

//   // loadItems(): void {
//   //   this.loaderService.show(); // Show loader
//   //   this.itemService.getItems().subscribe(items => {
//   //     this.items = items.map(this.mapItem);
//   //     this.totalItems = this.items.length;
//   //     this.filteredItems = [...this.items]; // Using spread operator for clarity
//   //     this.updatePageItems();
//   //     this.loaderService.hide(); // Hide loader after items are loaded
//   //   });
//   // }

//   loadItems(): void {
//     this.loaderService.show(); // Show loader
//     this.itemService.getItems().subscribe(items => {
//         this.items = items.map(this.mapItem);
//         this.totalItems = this.items.length;
//         this.filteredItems = [...this.items];
//         this.updatePageItems();
//         this.loaderService.hide(); // Hide loader after items are loaded
//     }, error => {
//         this.loaderService.hide(); // Hide loader if there's an error
//         console.error('Error loading items:', error);
//     });
// }

//   private mapItem(item: any): Item {
//     return {
//       id: item.id,
//       name: item.name,
//       dob: item.dateOfBirth,
//       gender: item.gender,
//       email: item.emailId,
//       phoneNumber: item.phoneNumbers.map((phone: { number: any; }) => phone.number),
//       selected: false // Initialize the selected property
//     };
//   }

//   updatePageItems(): void {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     this.filteredItems = this.items.slice(start, end);
//   }

//   editItem(id: number): void {
//     this.itemService.getItemById(id).subscribe(item => {
//       this.router.navigate(['/add-item'], { queryParams: { id, item: JSON.stringify(item) } });
//     });
//   }

//   deleteItem(id: number): void {
//     this.dataService.deleteItem(id).subscribe(() => {
//       console.log(`Item with id ${id} deleted.`);
//       this.loadItems(); // Reload items after deletion
//     });
//   }

//   toggleSelectAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.filteredItems.forEach(item => item.selected = checked);
//     this.selectedItems = checked ? this.filteredItems.map(item => item.id as number) : [];
//   }

//   onItemSelect(item: Item): void {
//     item.selected ? this.selectedItems.push(item.id as number) : this.removeFromSelectedItems(item.id as number);
//   }

//   private removeFromSelectedItems(id: number): void {
//     this.selectedItems = this.selectedItems.filter(itemId => itemId !== id);
//   }

//   deleteSelectedItems(): void {
//     if (this.selectedItems.length > 0) {
//       this.dataService.deleteItemsInBulk(this.selectedItems).subscribe({
//         next: () => {
//           console.log('Selected items deleted:', this.selectedItems);
//           this.selectedItems = []; // Clear the selected items array after deletion
//           this.loadItems(); // Reload items after deletion
//         },
//         error: (error) => {
//           console.error('Error deleting selected items:', error);
//         }
//       });
//     } else {
//       console.log('No items selected for deletion');
//     }
//   }

//   filterItems(): void {
//     const filtered = this.items.filter(item =>
//       this.matchesSearchTerm(item)
//     );
//     this.filteredItems = filtered;
//     this.totalItems = filtered.length; // Update total items based on filtered results
//     this.currentPage = 1; // Reset to the first page after filtering
//     this.updatePageItems(); // Update displayed items based on the new filtered results
//   }

//   private matchesSearchTerm(item: Item): boolean {
//     const term = this.searchTerm.toLowerCase();
//     return item.name.toLowerCase().includes(term) ||
//       item.dob.toLowerCase().includes(term) ||
//       item.gender.toLowerCase().includes(term) ||
//       item.email.toLowerCase().includes(term) ||
//       item.phoneNumber.some((phone: string) => phone.toLowerCase().includes(term)); // Explicitly typed as string
//   }

//   goToPage(page: number): void {
//     this.currentPage = page;
//     this.updatePageItems();
//   }

//   get totalPages(): number {
//     return Math.ceil(this.totalItems / this.itemsPerPage);
//   }
// }

// interface Item {
//   id?: number;
//   name: string;
//   dob: string;
//   gender: string;
//   email: string;
//   phoneNumber: string[];
//   selected?: boolean;
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ItemService } from '../item.service';
import { LoaderService } from '../loader.service';
import * as XLSX from 'xlsx'; // Import xlsx library

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  selectedItems: number[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private itemService: ItemService,
    private loaderService: LoaderService 
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loaderService.show(); // Show loader
    this.itemService.getItems().subscribe(items => {
        this.items = items.map(this.mapItem);
        this.totalItems = this.items.length;
        this.filteredItems = [...this.items];
        this.updatePageItems();
        this.loaderService.hide(); // Hide loader after items are loaded
    }, error => {
        this.loaderService.hide(); // Hide loader if there's an error
        console.error('Error loading items:', error);
    });
  }

  private mapItem(item: any): Item {
    return {
      id: item.id,
      name: item.name,
      dob: item.dateOfBirth,
      gender: item.gender,
      email: item.emailId,
      phoneNumber: item.phoneNumbers.map((phone: { number: any; }) => phone.number),
      selected: false
    };
  }

  updatePageItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredItems = this.items.slice(start, end);
  }

  editItem(id: number): void {
    this.loaderService.show(); // Show loader
    this.itemService.getItemById(id).subscribe(item => {
      this.router.navigate(['/add-item'], { queryParams: { id, item: JSON.stringify(item) } });
      this.loaderService.hide(); // Hide loader after navigating
    }, error => {
      this.loaderService.hide(); // Hide loader if there's an error
      console.error('Error loading item:', error);
    });
  }

  deleteItem(id: number): void {
    this.loaderService.show(); // Show loader
    this.dataService.deleteItem(id).subscribe(() => {
      console.log(`Item with id ${id} deleted.`);
      this.loadItems(); // Reload items after deletion
      this.loaderService.hide(); // Hide loader after deletion
    }, error => {
      this.loaderService.hide(); // Hide loader if there's an error
      console.error('Error deleting item:', error);
    });
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredItems.forEach(item => item.selected = checked);
    this.selectedItems = checked ? this.filteredItems.map(item => item.id as number) : [];
  }

  onItemSelect(item: Item): void {
    item.selected ? this.selectedItems.push(item.id as number) : this.removeFromSelectedItems(item.id as number);
  }

  private removeFromSelectedItems(id: number): void {
    this.selectedItems = this.selectedItems.filter(itemId => itemId !== id);
  }

  deleteSelectedItems(): void {
    if (this.selectedItems.length > 0) {
      this.loaderService.show(); // Show loader
      this.dataService.deleteItemsInBulk(this.selectedItems).subscribe({
        next: () => {
          console.log('Selected items deleted:', this.selectedItems);
          this.selectedItems = [];
          this.loadItems(); // Reload items after deletion
          this.loaderService.hide(); // Hide loader after deletion
        },
        error: (error) => {
          this.loaderService.hide(); // Hide loader if there's an error
          console.error('Error deleting selected items:', error);
        }
      });
    } else {
      console.log('No items selected for deletion');
    }
  }

  filterItems(): void {
    const filtered = this.items.filter(item => this.matchesSearchTerm(item));
    this.filteredItems = filtered;
    this.totalItems = filtered.length; // Update total items based on filtered results
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePageItems(); // Update displayed items based on the new filtered results
  }

  private matchesSearchTerm(item: Item): boolean {
    const term = this.searchTerm.toLowerCase();
    return item.name.toLowerCase().includes(term) ||
      item.dob.toLowerCase().includes(term) ||
      item.gender.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.phoneNumber.some((phone: string) => phone.toLowerCase().includes(term));
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePageItems();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredItems.map(item => ({
      Name: item.name,
      'Date of Birth': item.dob,
      Gender: item.gender,
      Email: item.email,
      'Phone Numbers': item.phoneNumber.join(', ')
    })));
    const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
    XLSX.writeFile(workbook, 'items_list.xlsx');
  }
}

interface Item {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  email: string;
  phoneNumber: string[];
  selected?: boolean;
}
