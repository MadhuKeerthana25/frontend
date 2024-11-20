// import { Component, Input, OnInit } from '@angular/core';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';

// @Component({
//   selector: 'app-custom-table',
//   templateUrl: './custom-table.component.html',
//   styleUrls: ['./custom-table.component.css']
// })
// export class CustomTableComponent implements OnInit {
//   @Input() columns: { header: string; field: string }[] = []; // Columns config
//   @Input() items: any[] = []; // Holds items data, now bindable from parent
//   @Input() allowBulkDelete: boolean = false; // Optional flag to show/hide bulk delete

//   selectedItems: Set<number> = new Set<number>(); // Tracks selected items for bulk delete

//   constructor(private dataService: DataService, private itemService: ItemService) {}

//   ngOnInit(): void {}

//   editItem(item: any): void {
//     // Emit or handle edit logic if required
//   }

//   deleteItem(id: number): void {
//     this.dataService.deleteItem(id).subscribe(() => {
//       // Update table by removing deleted item
//       this.items = this.items.filter(item => item.id !== id);
//     });
//   }

//   bulkDelete(): void {
//     const ids = Array.from(this.selectedItems);
//     this.dataService.deleteItemsInBulk(ids).subscribe(() => {
//       // Remove deleted items from the items array
//       this.items = this.items.filter(item => !this.selectedItems.has(item.id));
//       this.selectedItems.clear(); // Clear selection
//     });
//   }

//   downloadItems(format: string): void {
//     if (format === 'excel') {
//       this.downloadExcel();
//     } else if (format === 'pdf') {
//       this.downloadPDF();
//     }
//   }

//   private downloadExcel(): void {
//     // Code to generate and download Excel
//   }

//   private downloadPDF(): void {
//     // Code to generate and download PDF
//   }
// }



import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../models/item.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent {
  @Input() items: Item[] = [];
  @Input() loading: boolean = false;
  @Input() searchQuery: string = '';
  @Input() displayedFields: string[] = [];
  @Output() editItem = new EventEmitter<Item>();
  @Output() deleteItem = new EventEmitter<number>();
  @Output() bulkDeleteItems = new EventEmitter<number[]>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() selectAllItems = new EventEmitter<any>();
  @Output() selectItem = new EventEmitter<number>();
  @Output() downloadItems = new EventEmitter<string>(); 
  @Output() paginate = new EventEmitter<{ page: number, itemsPerPage: number }>(); 

  selectedItems: Set<number> = new Set<number>();
  selectedFormat: string = 'excel'; // Default format for download
  currentPage: number = 1; // Set the default page
  itemsPerPage: number = 5; // Set the default items per page

  // Getter for filtered items with pagination applied after filtering
  get filteredItems(): Item[] {
    const lowerSearchQuery = this.searchQuery.toLowerCase();

    // Filter items based on search query
    let filtered = this.items.filter(item => 
      (item.name && item.name.toLowerCase().includes(lowerSearchQuery)) ||
      (item.dob && item.dob.toLowerCase().includes(lowerSearchQuery)) ||
      (item.gender && item.gender.toLowerCase().includes(lowerSearchQuery)) ||
      (item.email && item.email.toLowerCase().includes(lowerSearchQuery)) ||
      (Array.isArray(item.phoneNumber) && item.phoneNumber.some((phone: string) => phone && phone.toLowerCase().includes(lowerSearchQuery)))
    );

    // Pagination: Paginate the filtered items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Getter for total pages
  get totalPages(): number {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    // Get total pages based on the filtered items and itemsPerPage
    const filteredItemsCount = this.items.filter(item => 
      (item.name && item.name.toLowerCase().includes(lowerSearchQuery)) ||
      (item.dob && item.dob.toLowerCase().includes(lowerSearchQuery)) ||
      (item.gender && item.gender.toLowerCase().includes(lowerSearchQuery)) ||
      (item.email && item.email.toLowerCase().includes(lowerSearchQuery)) ||
      (Array.isArray(item.phoneNumber) && item.phoneNumber.some((phone: string) => phone && phone.toLowerCase().includes(lowerSearchQuery)))
    ).length;
    return Math.ceil(filteredItemsCount / this.itemsPerPage);
  }

  // Emit search changes to parent component
  onSearchChanged(query: string): void {
    this.searchChanged.emit(query);
  }

  // Emit delete item event to parent component
  onDeleteItem(id: number): void {
    this.deleteItem.emit(id);
  }

  // Emit bulk delete event to parent component
  onBulkDelete(): void {
    const ids = Array.from(this.selectedItems);
    this.bulkDeleteItems.emit(ids);
  }

  // Handle selecting a single item
  onSelectItem(id: number): void {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }
  }

  // Handle selecting all items
  onSelectAllItems(event: any): void {
    this.selectAllItems.emit(event);
  }

  // Emit download request to parent component
  onDownload(): void {
    this.downloadItems.emit(this.selectedFormat); // Emit the selected format for download
  }

  // Get the phone numbers of an item
  getPhoneNumbers(item: Item): string {
    return item.phoneNumbers.map(pn => pn.number).join(', ');
  }

  // Emit edit item event to parent component
  onEditItem(item: Item): void {
    this.editItem.emit(item);  // Emit the item to be edited
  }

  // Check if all items are selected
  isAllItemsSelected(): boolean {
    return this.selectedItems.size === this.items.length;
  }

  // Handle page change and emit pagination event to parent component
  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate.emit({ page: this.currentPage, itemsPerPage: this.itemsPerPage });
  }
  
  isFieldDisplayed(field: string): boolean {
    return this.displayedFields.includes(field);
  }
}
