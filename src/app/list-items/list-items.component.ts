// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';
// import { LoaderService } from '../loader.service';
// import * as XLSX from 'xlsx'; // Import xlsx library
// import jsPDF from 'jspdf'; // For PDF export
// import 'jspdf-autotable'; // For table formatting in PDF

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
//   selectedItems: number[] = [];
  
//   // New property to hold selected file format
//   selectedFormat: string = 'excel'; // Default format

//   constructor(
//     private dataService: DataService,
//     private router: Router,
//     private itemService: ItemService,
//     private loaderService: LoaderService 
//   ) {}

//   ngOnInit(): void {
//     this.loadItems();
//   }

//   loadItems(): void {
//     this.loaderService.show(); // Show loader
//     this.itemService.getItems().subscribe(items => {
//       this.items = items.map(this.mapItem);
//       this.totalItems = this.items.length;
//       this.filteredItems = [...this.items];
//       this.updatePageItems();
//       this.loaderService.hide(); // Hide loader after items are loaded
//     }, error => {
//       this.loaderService.hide(); // Hide loader if there's an error
//       console.error('Error loading items:', error);
//     });
//   }

//   private mapItem(item: any): Item {
//     return {
//       id: item.id,
//       name: item.name,
//       dob: item.dateOfBirth, // Ensure dob is stored as string or a Date object
//       gender: item.gender,
//       email: item.emailId,
//       phoneNumber: item.phoneNumbers.map((phone: { number: any; }) => phone.number),
//       selected: false
//     };
//   }

//   updatePageItems(): void {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     this.filteredItems = this.items.slice(start, end);
//   }

//   editItem(id: number): void {
//     this.loaderService.show(); // Show loader
//     this.itemService.getItemById(id).subscribe(item => {
//       this.router.navigate(['/add-item'], { queryParams: { id, item: JSON.stringify(item) } });
//       this.loaderService.hide(); // Hide loader after navigating
//     }, error => {
//       this.loaderService.hide(); // Hide loader if there's an error
//       console.error('Error loading item:', error);
//     });
//   }

//   deleteItem(id: number): void {
//     this.loaderService.show(); // Show loader
//     this.dataService.deleteItem(id).subscribe(() => {
//       console.log(`Item with id ${id} deleted.`);
//       this.loadItems(); // Reload items after deletion
//       this.loaderService.hide(); // Hide loader after deletion
//     }, error => {
//       this.loaderService.hide(); // Hide loader if there's an error
//       console.error('Error deleting item:', error);
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
//       this.loaderService.show(); // Show loader
//       this.dataService.deleteItemsInBulk(this.selectedItems).subscribe({
//         next: () => {
//           console.log('Selected items deleted:', this.selectedItems);
//           this.selectedItems = [];
//           this.loadItems(); // Reload items after deletion
//           this.loaderService.hide(); // Hide loader after deletion
//         },
//         error: (error) => {
//           this.loaderService.hide(); // Hide loader if there's an error
//           console.error('Error deleting selected items:', error);
//         }
//       });
//     } else {
//       console.log('No items selected for deletion');
//     }
//   }

//   filterItems(): void {
//     const filtered = this.items.filter(item => this.matchesSearchTerm(item));
//     this.filteredItems = filtered;
//     this.totalItems = filtered.length; // Update total items based on filtered results
//     this.currentPage = 1; // Reset to the first page after filtering
//     this.updatePageItems(); // Update displayed items based on the new filtered results
//   }

//   private matchesSearchTerm(item: Item): boolean {
//     const term = this.searchTerm.toLowerCase();
    
//     // Ensure dob is either a string or a date converted to string
//     let dobString = '';
    
//     if (item.dob instanceof Date) {
//       dobString = item.dob.toLocaleDateString(); // Convert Date object to string
//     } else if (typeof item.dob === 'string') {
//       dobString = item.dob; // Use dob directly if it's a string
//     }
  
//     return item.name.toLowerCase().includes(term) ||
//       dobString.toLowerCase().includes(term) ||
//       item.gender.toLowerCase().includes(term) ||
//       item.email.toLowerCase().includes(term) ||
//       item.phoneNumber.some((phone: string) => phone.toLowerCase().includes(term));
//   }
  

//   goToPage(page: number): void {
//     this.currentPage = page;
//     this.updatePageItems();
//   }

//   get totalPages(): number {
//     return Math.ceil(this.totalItems / this.itemsPerPage);
//   }

//   // New method to download items based on selected format
//   downloadItems(): void {
//     if (this.selectedFormat === 'excel') {
//       this.downloadExcel();
//     } else if (this.selectedFormat === 'pdf') {
//       this.downloadPDF();
//     }
//   }


//   downloadExcel(): void {
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredItems.map(item => ({
//         Name: item.name,
//         'Date of Birth': this.formatDate(item.dob), // Use the formatDate method
//         Gender: item.gender,
//         Email: item.email,
//         'Phone Numbers': item.phoneNumber.join(', ')
//     })));
//     const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
//     XLSX.writeFile(workbook, 'items_list.xlsx');
// }

// // Helper method to format the date
// private formatDate(dob: string | Date): string {
//     if (dob instanceof Date) {
//         return dob.toLocaleDateString();
//     }
//     return dob; // return as-is if it's already a string
// }

//   // New method to download PDF
//   downloadPDF(): void {
//     const doc = new jsPDF();
//     const tableColumnHeaders = ['Name', 'Date of Birth', 'Gender', 'Email', 'Phone Numbers'];
//     const tableRows = this.filteredItems.map(item => [
//       item.name,
//       typeof item.dob === 'string' ? item.dob : (item.dob instanceof Date ? item.dob.toLocaleDateString() : ''), // Check for Date instance
//       item.gender,
//       item.email,
//       item.phoneNumber.join(', ')
//     ]);
  
//     // Adding the title
//     doc.text('List of Items', 14, 16);
  
//     // Adding the table
//     (doc as any).autoTable({
//       head: [tableColumnHeaders],
//       body: tableRows,
//       startY: 20
//     });
  
//     // Save the generated PDF
//     doc.save('items_list.pdf');
//   }  
// }

// interface Item {
//   id?: number;
//   name: string;
//   dob: string | Date; // Allow dob to be either a string or Date object
//   gender: string;
//   email: string;
//   phoneNumber: string[];
//   selected?: boolean;
// }



// 1st code for custom table

// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';
// import { LoaderService } from '../loader.service';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// @Component({
//   selector: 'app-list-items',
//   templateUrl: './list-items.component.html',
//   styleUrls: ['./list-items.component.css']
// })
// export class ListItemsComponent implements OnInit {
// deleteItem($event: Event) {
// throw new Error('Method not implemented.');
// }
// editItem //     const checked = (event.target as HTMLInputElement).checked;
// ($event: Event) {
// throw new Error('Method not implemented.');
// }
//   items: Item[] = [];
//   filteredItems: Item[] = [];
//   searchTerm: string = '';
//   selectedItems: number[] = [];
//   selectedFormat: string = 'excel';

//   // Column configuration for the custom table component
//   columns = [
//     { header: 'Name', field: 'name' },
//     { header: 'Date of Birth', field: 'dob' },
//     { header: 'Gender', field: 'gender' },
//     { header: 'Email', field: 'email' },
//     { header: 'Phone Numbers', field: 'phoneNumber' }
//   ];

//   constructor(
//     private dataService: DataService,
//     private itemService: ItemService,
//     private loaderService: LoaderService 
//   ) {}

//   ngOnInit(): void {
//     this.loadItems();
//   }

//   loadItems(): void {
//     this.loaderService.show();
//     this.itemService.getItems().subscribe(items => {
//       this.items = items.map(this.mapItem);
//       this.filteredItems = [...this.items];
//       this.loaderService.hide();
//     }, error => {
//       this.loaderService.hide();
//       console.error('Error loading items:', error);
//     });
//   }

//   private mapItem(item: any): Item {
//     return {
//       id: item.id,
//       name: item.name,
//       dob: item.dateOfBirth,
//       gender: item.gender,
//       email: item.emailId,
//       phoneNumber: item.phoneNumbers.map((phone: { number: any; }) => phone.number),
//       selected: false
//     };
//   }

//   filterItems(): void {
//     this.filteredItems = this.items.filter(item => this.matchesSearchTerm(item));
//   }

//   private matchesSearchTerm(item: Item): boolean {
//     const term = this.searchTerm.toLowerCase();
//     return item.name.toLowerCase().includes(term) ||
//       (typeof item.dob === 'string' ? item.dob : item.dob.toLocaleDateString()).includes(term) ||
//       item.gender.toLowerCase().includes(term) ||
//       item.email.toLowerCase().includes(term) ||
//       item.phoneNumber.some(phone => phone.toLowerCase().includes(term));
//   }

//   deleteSelectedItems(): void {
//     if (this.selectedItems.length > 0) {
//       this.loaderService.show();
//       this.dataService.deleteItemsInBulk(this.selectedItems).subscribe(() => {
//         this.loadItems();
//         this.selectedItems = [];
//         this.loaderService.hide();
//       }, error => {
//         this.loaderService.hide();
//         console.error('Error deleting selected items:', error);
//       });
//     }
//   }

//   downloadItems(): void {
//     if (this.selectedFormat === 'excel') {
//       this.downloadExcel();
//     } else if (this.selectedFormat === 'pdf') {
//       this.downloadPDF();
//     }
//   }

//   private downloadExcel(): void {
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredItems.map(item => ({
//       Name: item.name,
//       'Date of Birth': this.formatDate(item.dob),
//       Gender: item.gender,
//       Email: item.email,
//       'Phone Numbers': item.phoneNumber.join(', ')
//     })));
//     const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
//     XLSX.writeFile(workbook, 'items_list.xlsx');
//   }

//   private formatDate(dob: string | Date): string {
//     return dob instanceof Date ? dob.toLocaleDateString() : dob;
//   }

//   private downloadPDF(): void {
//     const doc = new jsPDF();
//     const tableColumnHeaders = ['Name', 'Date of Birth', 'Gender', 'Email', 'Phone Numbers'];
//     const tableRows = this.filteredItems.map(item => [
//       item.name,
//       this.formatDate(item.dob),
//       item.gender,
//       item.email,
//       item.phoneNumber.join(', ')
//     ]);
//     doc.text('List of Items', 14, 16);
//     (doc as any).autoTable({
//       head: [tableColumnHeaders],
//       body: tableRows,
//       startY: 20
//     });
//     doc.save('items_list.pdf');
//   }
// }

// interface Item {
//   id?: number;
//   name: string;
//   dob: string | Date;
//   gender: string;
//   email: string;
//   phoneNumber: string[];
//   selected?: boolean;
// }


//2nd code for custom table

// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';
// import { LoaderService } from '../loader.service';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// @Component({
//   selector: 'app-list-items',
//   templateUrl: './list-items.component.html',
//   styleUrls: ['./list-items.component.css']
// })
// export class ListItemsComponent implements OnInit {
//   items: Item[] = [];
//   filteredItems: Item[] = [];
//   searchTerm: string = '';
//   selectedItems: number[] = [];
//   selectedFormat: string = 'excel';

//   columns = [
//     { header: 'Name', field: 'name' },
//     { header: 'Date of Birth', field: 'dob' },
//     { header: 'Gender', field: 'gender' },
//     { header: 'Email', field: 'email' },
//     { header: 'Phone Numbers', field: 'phoneNumber' }
//   ];

//   constructor(
//     private dataService: DataService,
//     private itemService: ItemService,
//     private loaderService: LoaderService 
//   ) {}

//   ngOnInit(): void {
//     this.loadItems();
//   }

//   loadItems(): void {
//     this.loaderService.show();
//     this.itemService.getItems().subscribe(items => {
//       this.items = items.map(this.mapItem);
//       this.filteredItems = [...this.items];
//       this.loaderService.hide();
//     }, error => {
//       this.loaderService.hide();
//       console.error('Error loading items:', error);
//     });
//   }

//   private mapItem(item: any): Item {
//     return {
//       id: item.id,
//       name: item.name,
//       dob: item.dateOfBirth,
//       gender: item.gender,
//       email: item.emailId,
//       phoneNumber: item.phoneNumbers.map((phone: { number: any; }) => phone.number),
//       selected: false
//     };
//   }

//   filterItems(): void {
//     this.filteredItems = this.items.filter(item => this.matchesSearchTerm(item));
//   }

//   private matchesSearchTerm(item: Item): boolean {
//     const term = this.searchTerm.toLowerCase();
//     return item.name.toLowerCase().includes(term) ||
//       (typeof item.dob === 'string' ? item.dob : item.dob.toLocaleDateString()).includes(term) ||
//       item.gender.toLowerCase().includes(term) ||
//       item.email.toLowerCase().includes(term) ||
//       item.phoneNumber.some(phone => phone.toLowerCase().includes(term));
//   }

//   editItem(item: any): void {
//     // Implement edit logic here
//   }

//   deleteItem(id: number): void {
//     this.dataService.deleteItem(id).subscribe(() => {
//       this.loadItems();
//     });
//   }

//   deleteSelectedItems(): void {
//     if (this.selectedItems.length > 0) {
//       this.loaderService.show();
//       this.dataService.deleteItemsInBulk(this.selectedItems).subscribe(() => {
//         this.loadItems();
//         this.selectedItems = [];
//         this.loaderService.hide();
//       }, error => {
//         this.loaderService.hide();
//         console.error('Error deleting selected items:', error);
//       });
//     }
//   }

//   downloadItems(format: string): void {
//     if (format === 'excel') {
//       this.downloadExcel();
//     } else if (format === 'pdf') {
//       this.downloadPDF();
//     }
//   }  

  // private downloadExcel(): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredItems.map(item => ({
  //     Name: item.name,
  //     'Date of Birth': this.formatDate(item.dob),
  //     Gender: item.gender,
  //     Email: item.email,
  //     'Phone Numbers': item.phoneNumber.join(', ')
  //   })));
  //   const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
  //   XLSX.writeFile(workbook, 'items_list.xlsx');
  // }

  // private formatDate(dob: string | Date): string {
  //   return dob instanceof Date ? dob.toLocaleDateString() : dob;
  // }

//   private downloadPDF(): void {
//     const doc = new jsPDF();
//     const tableColumnHeaders = ['Name', 'Date of Birth', 'Gender', 'Email', 'Phone Numbers'];
//     const tableRows = this.filteredItems.map(item => [
//       item.name,
//       this.formatDate(item.dob),
//       item.gender,
//       item.email,
//       item.phoneNumber.join(', ')
//     ]);
//     doc.text('List of Items', 14, 16);
//     (doc as any).autoTable({
//       head: [tableColumnHeaders],
//       body: tableRows,
//       startY: 20
//     });
//     doc.save('items_list.pdf');
//   }
// }

// interface Item {
//   id?: number;
//   name: string;
//   dob: string | Date;
//   gender: string;
//   email: string;
//   phoneNumber: string[];
//   selected?: boolean;
// }






// 3rd code for custom table


// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';
// import { LoaderService } from '../loader.service';
// import { Item } from '../models/item.model';
// import * as XLSX from 'xlsx'; // For Excel export
// import jsPDF from 'jspdf'; // For PDF export
// import 'jspdf-autotable'; // For table formatting in PDF
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-list-items',
//   templateUrl: './list-items.component.html',
//   styleUrls: ['./list-items.component.css']
// })
// export class ListItemsComponent implements OnInit {
//   items: Item[] = [];
//   loading: boolean = false;
//   searchQuery: string = '';
//   selectedItems: Set<number> = new Set<number>();
//   isEditModalOpen: boolean = false;
//   selectedItem: Item | null = null; // To store the item being edited


//   constructor(
//     private dataService: DataService,
//     private itemService: ItemService,
//     private loaderService: LoaderService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loaderService.isLoading$.subscribe(loading => this.loading = loading);
//     this.fetchItems();
//   }

//   fetchItems(): void {
//     this.loaderService.show();
//     this.dataService.getItems().subscribe(items => {
//       this.items = items;
//       this.loaderService.hide();
//     });
//   }

//   onSearchChanged(query: string): void {
//     this.searchQuery = query;
//     this.fetchItems();
//   }

//   onEditItem(item: Item): void {
//     // Navigate to the 'add-item' route with the item's id as a route parameter
//     this.router.navigate(['/add-item', item.id]);
//   }

//   closeEditModal(): void {
//     this.isEditModalOpen = false; // Close the edit modal
//   }

//   onSubmitEdit(): void {
//     if (this.selectedItem && this.selectedItem.id) {  // Ensure id is valid
//       this.itemService.updateItem(this.selectedItem.id, this.selectedItem).subscribe(() => {
//         this.fetchItems(); // Refresh the items list after updating
//         this.closeEditModal(); // Close the modal
//       }, error => {
//         console.error('Error updating item:', error);  // Handle the error if needed
//         alert('Failed to update item.');
//       });
//     } else {
//       alert('Invalid item ID');  // Handle the case when the item ID is not available
//     }
//   }
  

//   onDeleteItem(id: number): void {
//     this.itemService.ddeleteItem(id).subscribe(() => {
//       this.fetchItems();
//     });
//   }

//   onBulkDeleteItems(ids: number[]): void {
//     if (ids.length === 0) {
//       alert('No items selected for bulk delete.');
//       return;
//     }

//     this.dataService.deleteItemsInBulk(ids).subscribe({
//       next: () => {
//         this.selectedItems.clear();
//         this.fetchItems();
//       },
//       error: (error) => {
//         console.error('Error deleting items in bulk:', error);
//         alert('An error occurred while deleting the items.');
//       }
//     });
//   }

//   onDownloadItems(format: string): void {
//     if (format === 'excel') {
//       this.downloadExcel();
//     } else if (format === 'pdf') {
//       this.downloadPDF();
//     }
//   }

//   downloadExcel(): void {
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.items.map(item => ({
//       Name: item.name,
//       'Date of Birth': new Date(item.dateOfBirth).toLocaleDateString(),
//       Gender: item.gender,
//       Email: item.emailId || '',
//       'Phone Numbers': (item.phoneNumbers && item.phoneNumbers.length > 0) 
//         ? item.phoneNumbers.map(p => p.number).join(', ') 
//         : ''
//     })));
  
//     const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
//     XLSX.writeFile(workbook, 'items_list.xlsx');
//   }
  
  
//   downloadPDF(): void {
//     const doc = new jsPDF();
//     const tableColumnHeaders = ['Name', 'Date of Birth', 'Gender', 'Email', 'Phone Numbers'];
    
//     // Map the data for the PDF export
//     const tableRows = this.items.map(item => {
//       const phoneNumbers = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers.map(p => p.number).join(', ') : '';

      
//       // Debug: Log the item data to check its structure
//       console.log('Item Data:', item);
      
//       return [
//         item.name,
//         new Date(item.dateOfBirth).toLocaleDateString(), // Format date
//         item.gender,
//         item.emailId || '', // Fallback to empty string if email is null or undefined
//         phoneNumbers// If phone numbers are missing or null, provide empty string .join(', ')
//       ];
//     });
  
//     doc.text('List of Items', 14, 16);
  
//     (doc as any).autoTable({
//       head: [tableColumnHeaders],
//       body: tableRows,
//       startY: 20
//     });
  
//     doc.save('items_list.pdf');
//   }
  
  
  
  

//   onSelectItem(id: number): void {
//     if (this.selectedItems.has(id)) {
//       this.selectedItems.delete(id);
//     } else {
//       this.selectedItems.add(id);
//     }
//   }

//   onSelectAllItems(event: any): void {
//     if (event.target.checked) {
//       this.items.forEach(item => this.selectedItems.add(item.id ? item.id : 0));
//     } else {
//       this.selectedItems.clear();
//     }
//   }

//   isAllItemsSelected(): boolean {
//     return this.selectedItems.size === this.items.length;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ItemService } from '../item.service';
import { LoaderService } from '../loader.service';
import { Item } from '../models/item.model';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import { Router } from '@angular/router';
import ExcelJS from 'exceljs';
import { MyKommu1libComponent } from 'my-kommu1lib';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {
  items: Item[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  selectedItems: Set<number> = new Set<number>();
  isEditModalOpen: boolean = false;
  selectedItem: Item | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private dataService: DataService,
    private itemService: ItemService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe(loading => this.loading = loading);
    this.fetchItems();
  }

  fetchItems(): void {
    this.loaderService.show();
    this.dataService.getItems().subscribe(items => {
      this.items = items;
      this.loaderService.hide();
    });
  }

  onSearchChanged(query: string): void {
    this.searchQuery = query;
    this.fetchItems();
  }

  onEditItem(item: Item): void {
    this.router.navigate(['/add-item', item.id]);
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  onSubmitEdit(): void {
    if (this.selectedItem && this.selectedItem.id) {
      this.itemService.updateItem(this.selectedItem.id, this.selectedItem).subscribe(() => {
        this.fetchItems();
        this.closeEditModal();
      }, error => {
        console.error('Error updating item:', error);
        alert('Failed to update item.');
      });
    } else {
      alert('Invalid item ID');
    }
  }

  onDeleteItem(id: number): void {
    this.itemService.ddeleteItem(id).subscribe(() => {
      this.fetchItems();
    });
  }

  onBulkDeleteItems(ids: number[]): void {
    if (ids.length === 0) {
      alert('No items selected for bulk delete.');
      return;
    }

    this.dataService.deleteItemsInBulk(ids).subscribe({
      next: () => {
        this.selectedItems.clear();
        this.fetchItems();
      },
      error: (error) => {
        console.error('Error deleting items in bulk:', error);
        alert('An error occurred while deleting the items.');
      }
    });
  }

  onDownloadItems(format: string): void {
    if (format === 'excel') {
      this.downloadExcel();
    } else if (format === 'pdf') {
      this.downloadPDF();
    }
  }

  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.items.map(item => ({
      Name: item.name,
      'Date of Birth': new Date(item.dateOfBirth).toLocaleDateString(),
      Gender: item.gender,
      Email: item.emailId || '',
      'Phone Numbers': (item.phoneNumbers && item.phoneNumbers.length > 0) 
        ? item.phoneNumbers.map(p => p.number).join(', ') 
        : ''
    })));
  
    const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
    XLSX.writeFile(workbook, 'items_list.xlsx');
  }
  
  downloadPDF(): void {
    const doc = new jsPDF();
    const tableColumnHeaders = ['Name', 'Date of Birth', 'Gender', 'Email', 'Phone Numbers'];
    
    const tableRows = this.items.map(item => {
      const phoneNumbers = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers.map(p => p.number).join(', ') : '';
      return [
        item.name,
        new Date(item.dateOfBirth).toLocaleDateString(),
        item.gender,
        item.emailId || '',
        phoneNumbers
      ];
    });
  
    doc.text('List of Items', 14, 16);
  
    (doc as any).autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20
    });
  
    doc.save('items_list.pdf');
  }

  onSelectItem(id: number): void {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }
  }

  onSelectAllItems(event: any): void {
    if (event.target.checked) {
      this.items.forEach(item => this.selectedItems.add(item.id ? item.id : 0));
    } else {
      this.selectedItems.clear();
    }
  }

  isAllItemsSelected(): boolean {
    return this.selectedItems.size === this.items.length;
  }

  // Listen for pagination event
  onPaginate(event: { page: number, itemsPerPage: number }): void {
    this.currentPage = event.page;
    this.itemsPerPage = event.itemsPerPage;
    this.fetchItems();
  }
}

