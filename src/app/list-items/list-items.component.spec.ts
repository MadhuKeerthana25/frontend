import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import * as XLSX from 'xlsx';

// Mock services
import { ItemService } from '../item.service';
import { LoaderService } from '../loader.service';
import { DataService } from '../data.service';

// Mock AppHeaderComponent
@Component({
  selector: 'app-header',
  template: '<div></div>' // Provide a simple template for the mock
})
class MockAppHeaderComponent {}

import { ListItemsComponent } from './list-items.component';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

describe('ListItemsComponent', () => {
  let component: ListItemsComponent;
  let fixture: ComponentFixture<ListItemsComponent>;
  let itemService: jasmine.SpyObj<ItemService>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let dataService: jasmine.SpyObj<DataService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock services
    const itemServiceSpy = jasmine.createSpyObj('ItemService', ['getItems', 'getItemById']);
    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['deleteItem']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    itemServiceSpy.getItems.and.returnValue(of([
      { id: 1, name: 'Item 1', dateOfBirth: '1990-01-01', gender: 'Male', emailId: 'item1@example.com', phoneNumbers: [{ number: '12345' }] },
      { id: 2, name: 'Item 2', dateOfBirth: '1992-02-02', gender: 'Female', emailId: 'item2@example.com', phoneNumbers: [{ number: '67890' }] }
    ]));

    // Mock implementation for getItemById
    itemServiceSpy.getItemById.and.returnValue(of({ id: 1, name: 'Item 1', dateOfBirth: '1990-01-01', gender: 'Male', emailId: 'item1@example.com', phoneNumbers: [{ number: '12345' }] }));

    await TestBed.configureTestingModule({
      declarations: [
        ListItemsComponent,
        MockAppHeaderComponent // Use the mock component
      ],
      imports: [
        HttpClientModule,
        FormsModule // Add FormsModule for form support
      ],
      providers: [
        { provide: ItemService, useValue: itemServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: Router, useValue: routerSpy }, // Provide the mock router
        { provide: DataService, useValue: dataServiceSpy } // Mock DataService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>; // Inject the mock router
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items successfully and show/hide loader', () => {
    // Call the method
    component.loadItems();

    // Ensure loader is shown
    expect(loaderService.show).toHaveBeenCalled();

    // Ensure getItems was called
    expect(itemService.getItems).toHaveBeenCalled();

    // Check that items are loaded correctly
    expect(component.items.length).toBe(2);
    expect(component.filteredItems.length).toBe(2);

    // Ensure loader is hidden
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should handle errors when loading items and hide the loader', () => {
    // Mock an error response from itemService.getItems
    const errorMessage = 'Error loading items';
    itemService.getItems.and.returnValue(throwError(() => new Error(errorMessage)));

    // Spy on console.error to check if the error was logged
    spyOn(console, 'error');

    // Call the method
    component.loadItems();

    // Check that the loader is shown
    expect(loaderService.show).toHaveBeenCalled();

    // Trigger change detection to update the view
    fixture.detectChanges();

    // Check that the loader is hidden after the error
    expect(loaderService.hide).toHaveBeenCalled();

    // Ensure the error was logged with the correct message
    expect(console.error).toHaveBeenCalledWith('Error loading items:', jasmine.any(Error));
  });

  it('should map the items correctly', () => {
    const rawItem = {
      id: 1,
      name: 'Raw Item',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      emailId: 'rawitem@example.com',
      phoneNumbers: [{ number: '98765' }]
    };

    const mappedItem = component['mapItem'](rawItem);

    expect(mappedItem.id).toBe(rawItem.id);
    expect(mappedItem.name).toBe(rawItem.name);
    expect(mappedItem.dob).toBe(rawItem.dateOfBirth);
    expect(mappedItem.gender).toBe(rawItem.gender);
    expect(mappedItem.email).toBe(rawItem.emailId);
    expect(mappedItem.phoneNumber.length).toBe(1);
    expect(mappedItem.phoneNumber[0]).toBe('98765');
  });

  // New test cases for editItem
  it('should navigate to add-item on successful edit', () => {
    const id = 1;

    component.onEditItem; // Call the method with a valid ID

    expect(loaderService.show).toHaveBeenCalled(); // Ensure loader is shown
    expect(itemService.getItemById).toHaveBeenCalledWith(id); // Ensure getItemById was called with the correct ID

    // Trigger change detection to allow asynchronous operations to complete
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/add-item'], { queryParams: { id, item: JSON.stringify({ id: 1, name: 'Item 1', dateOfBirth: '1990-01-01', gender: 'Male', emailId: 'item1@example.com', phoneNumbers: [{ number: '12345' }] }) } }); // Ensure navigation happened
    expect(loaderService.hide).toHaveBeenCalled(); // Ensure loader is hidden after navigation
  });

  it('should handle error while editing and hide loader', () => {
    const id = 1;
    const errorMessage = 'Error loading item';
    itemService.getItemById.and.returnValue(throwError(() => new Error(errorMessage))); // Mock error response

    spyOn(console, 'error'); // Spy on console.error to check if the error was logged

    component.onEditItem(id); // Call the method with a valid ID

    expect(loaderService.show).toHaveBeenCalled(); // Ensure loader is shown

    // Trigger change detection to update the view
    fixture.detectChanges();

    expect(loaderService.hide).toHaveBeenCalled(); // Ensure loader is hidden after the error
    expect(console.error).toHaveBeenCalledWith('Error loading item:', jasmine.any(Error)); // Ensure the error was logged
  });


  // Test case for deleteItem
  it('should delete item successfully and reload items', () => {
    const id = 1;
  
    dataService.deleteItem.and.returnValue(of(undefined)); // Mock a successful delete operation returning void
    spyOn(component, 'loadItems'); // Spy on loadItems to ensure it's called after deletion
  
    component.onDeleteItem(id); // Call the deleteItem method
  
    expect(loaderService.show).toHaveBeenCalled(); // Ensure loader is shown
    expect(dataService.deleteItem).toHaveBeenCalledWith(id); // Ensure deleteItem was called with the correct ID
    expect(component.loadItems).toHaveBeenCalled(); // Ensure loadItems is called after deletion
    expect(loaderService.hide).toHaveBeenCalled(); // Ensure loader is hidden after deletion
  });

    // Test case for toggleSelectAll
  it('should toggle select all items correctly', () => {
    component.filteredItems = [
      { id: 1, name: 'Item 1', dob: '1990-01-01', gender: 'Male', email: 'item1@example.com', phoneNumber: ['12345'], selected: false },
      { id: 2, name: 'Item 2', dob: '1992-02-02', gender: 'Female', email: 'item2@example.com', phoneNumber: ['67890'], selected: false }
    ];

    // Mock the event with target.checked
    const mockEvent = {
      target: {
        checked: true // Simulate checkbox being checked
      }
    } as unknown as Event; // Cast to Event type
    
    component.toggleSelectAll(mockEvent); // Pass the mock event
    
    expect(component.selectedItems.length).toBe(2); // Both items should be selected
  });


    it('should toggle select all items to false', () => {
    component.filteredItems = [
      { id: 1, name: 'Item 1', dob: '1990-01-01', gender: 'Male', email: 'item1@example.com', phoneNumber: ['12345'], selected: true },
      { id: 2, name: 'Item 2', dob: '1992-02-02', gender: 'Female', email: 'item2@example.com', phoneNumber: ['67890'], selected: true }
    ];

    // Mock the event with target.checked set to false
    const mockEvent = {
      target: {
        checked: false // Simulate checkbox being unchecked
      }
    } as unknown as Event; // Cast to Event type
    
    component.toggleSelectAll(mockEvent); // Pass the mock event
    
    expect(component.selectedItems.length).toBe(0); // No items should be selected
  });

    // Test case for onItemSelect
    it('should update selected items correctly on item selection', () => {
      // Ensure that selectedItems starts as an empty array
      component.selectedItems = [];
    
      const item = { id: 1, name: 'Item 1', dob: '1990-01-01', gender: 'Male', email: 'item1@example.com', phoneNumber: ['12345'], selected: false };
    
      // Simulate selecting the item
      item.selected = true; // Mark the item as selected
      component.onItemSelect(item);
    
      // Check that the item ID has been added to selectedItems
      expect(component.selectedItems.length).toBe(1);
      expect(component.selectedItems[0]).toBe(item.id); // Verify correct item ID is added
    
      // Simulate deselecting the item
      item.selected = false; // Mark the item as deselected
      component.onItemSelect(item);
    
      // Check that selectedItems is now empty
      expect(component.selectedItems.length).toBe(0);
    });
    
  
    // it('should download items in Excel format correctly', () => {
    //   // Setup mock data
    //   component.filteredItems = [
    //     { id: 1, name: 'Item 1', dob: '1990-01-01', gender: 'Male', email: 'item1@example.com', phoneNumber: ['12345'] },
    //     { id: 2, name: 'Item 2', dob: '1992-02-02', gender: 'Female', email: 'item2@example.com', phoneNumber: ['67890'] }
    //   ];
    
    //   // Mock the writeFile method
    //   spyOn(XLSX, 'writeFile').and.stub(); // Use and.stub() to avoid actual file writing
    
    //   component.downloadItems(); // Call the download method
    
    //   expect(XLSX.writeFile).toHaveBeenCalled(); // Ensure writeFile was called
    // });
    

    
    // it('should download items in PDF format correctly', () => {
    //   // Setup mock data
    //   component.filteredItems = [
    //     { id: 1, name: 'Item 1', dob: '1990-01-01', gender: 'Male', email: 'item1@example.com', phoneNumber: ['12345'] },
    //     { id: 2, name: 'Item 2', dob: '1992-02-02', gender: 'Female', email: 'item2@example.com', phoneNumber: ['67890'] }
    //   ];
    
    //   // Mock the jsPDF constructor and its instance methods
    //   const jsPDFMock = jasmine.createSpyObj('jsPDF', ['save']);
    //   spyOn(window as any, 'jsPDF').and.returnValue(jsPDFMock); // Mock the jsPDF constructor
      
    //   component.selectedFormat = 'pdf'; // Set format to PDF
    //   component.downloadItems(); // Call the download method
      
    //   expect(jsPDFMock.save).toHaveBeenCalledWith('items_list.pdf'); // Ensure save was called with correct filename
    // });
    

    // it('should delete selected items successfully and reload the items', () => {
    //   component.selectedItems = [1, 2]; // Mock selected items
    //   const mockResponse = of(undefined); // Mock a successful delete operation
      
    //   dataService.deleteItemsInBulk.and.returnValue(mockResponse); // Ensure deleteItemsInBulk is mocked correctly
      
    //   spyOn(component, 'loadItems'); // Spy on loadItems to ensure it's called after deletion
      
    //   component.deleteSelectedItems(); // Call the method to delete selected items
      
    //   expect(loaderService.show).toHaveBeenCalled(); // Ensure loader is shown
    //   expect(dataService.deleteItemsInBulk).toHaveBeenCalledWith(component.selectedItems); // Ensure deleteItemsInBulk was called with selected items
    //   expect(component.loadItems).toHaveBeenCalled(); // Ensure items are reloaded after deletion
    //   expect(component.selectedItems.length).toBe(0); // Ensure selected items are cleared after deletion
    //   expect(loaderService.hide).toHaveBeenCalled(); // Ensure loader is hidden
    // });
    
    

  it('should handle error when deleting item and hide loader', () => {
    const id = 1;
    const errorMessage = 'Error deleting item';
    dataService.deleteItem.and.returnValue(throwError(() => new Error(errorMessage))); // Mock an error during deletion

    spyOn(console, 'error'); // Spy on console.error to ensure error logging

    component.onDeleteItem(id); // Call the deleteItem method

    expect(loaderService.show).toHaveBeenCalled(); // Ensure loader is shown
    expect(dataService.deleteItem).toHaveBeenCalledWith(id); // Ensure deleteItem was called with the correct ID

    // Trigger change detection to allow asynchronous operations to complete
    fixture.detectChanges();

    expect(loaderService.hide).toHaveBeenCalled(); // Ensure loader is hidden after error
    expect(console.error).toHaveBeenCalledWith('Error deleting item:', jasmine.any(Error)); // Ensure error is logged
  });
});