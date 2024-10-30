import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ItemService } from '../item.service';
import { LoaderService } from '../loader.service';
import * as XLSX from 'xlsx'; // Import xlsx library
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF

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
  
  // New property to hold selected file format
  selectedFormat: string = 'excel'; // Default format

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
      dob: item.dateOfBirth, // Ensure dob is stored as string or a Date object
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
    
    // Ensure dob is either a string or a date converted to string
    let dobString = '';
    
    if (item.dob instanceof Date) {
      dobString = item.dob.toLocaleDateString(); // Convert Date object to string
    } else if (typeof item.dob === 'string') {
      dobString = item.dob; // Use dob directly if it's a string
    }
  
    return item.name.toLowerCase().includes(term) ||
      dobString.toLowerCase().includes(term) ||
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

  // New method to download items based on selected format
  downloadItems(): void {
    if (this.selectedFormat === 'excel') {
      this.downloadExcel();
    } else if (this.selectedFormat === 'pdf') {
      this.downloadPDF();
    }
  }

  // Existing method to download Excel
  // downloadExcel(): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredItems.map(item => ({
  //     Name: item.name,
  //     'Date of Birth': typeof item.dob === 'string' ? item.dob : item.dob.toLocaleDateString(), // Convert dob to string
  //     Gender: item.gender,
  //     Email: item.email,
  //     'Phone Numbers': item.phoneNumber.join(', ')
  //   })));
  //   const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
  //   XLSX.writeFile(workbook, 'items_list.xlsx');
  // }

  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredItems.map(item => ({
        Name: item.name,
        'Date of Birth': this.formatDate(item.dob), // Use the formatDate method
        Gender: item.gender,
        Email: item.email,
        'Phone Numbers': item.phoneNumber.join(', ')
    })));
    const workbook: XLSX.WorkBook = { Sheets: { 'Items': worksheet }, SheetNames: ['Items'] };
    XLSX.writeFile(workbook, 'items_list.xlsx');
}

// Helper method to format the date
private formatDate(dob: string | Date): string {
    if (dob instanceof Date) {
        return dob.toLocaleDateString();
    }
    return dob; // return as-is if it's already a string
}

  // New method to download PDF
  downloadPDF(): void {
    const doc = new jsPDF();
    const tableColumnHeaders = ['Name', 'Date of Birth', 'Gender', 'Email', 'Phone Numbers'];
    const tableRows = this.filteredItems.map(item => [
      item.name,
      typeof item.dob === 'string' ? item.dob : (item.dob instanceof Date ? item.dob.toLocaleDateString() : ''), // Check for Date instance
      item.gender,
      item.email,
      item.phoneNumber.join(', ')
    ]);
  
    // Adding the title
    doc.text('List of Items', 14, 16);
  
    // Adding the table
    (doc as any).autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20
    });
  
    // Save the generated PDF
    doc.save('items_list.pdf');
  }  
}

interface Item {
  id?: number;
  name: string;
  dob: string | Date; // Allow dob to be either a string or Date object
  gender: string;
  email: string;
  phoneNumber: string[];
  selected?: boolean;
}



