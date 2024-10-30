import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpClientTestingModule and HttpTestingController
import { ItemService } from './item.service';
import { Item } from './models/item.model'; // Import Item model

describe('ItemService', () => {
  let service: ItemService;
  let httpTestingController: HttpTestingController; // Declare HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Add HttpClientTestingModule here
    });
    service = TestBed.inject(ItemService);
    httpTestingController = TestBed.inject(HttpTestingController); // Inject HttpTestingController
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items successfully', () => {
    const mockItems: Item[] = [
      {
        id: 1,
        name: 'Item 1',
        dateOfBirth: '',
        gender: '',
        emailId: '',
        phoneNumbers: []
      },
      {
        id: 2,
        name: 'Item 2',
        dateOfBirth: '',
        gender: '',
        emailId: '',
        phoneNumbers: []
      },
    ];

    service.getItems().subscribe(items => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/getAllItems`); // Expect a single request to the URL
    expect(req.request.method).toEqual('GET'); // Verify request method
    req.flush(mockItems); // Respond with mock items
  });

  it('should fetch an item by ID successfully', () => {
    const mockItem: Item = {
      id: 1,
      name: 'Item 1',
      dateOfBirth: '',
      gender: '',
      emailId: '',
      phoneNumbers: []
    };

    const itemId = 1; // The ID of the item we want to fetch

    service.getItemById(itemId).subscribe(item => {
      expect(item).toEqual(mockItem);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/getItemById/${itemId}`); // Expect a request to the URL with item ID
    expect(req.request.method).toEqual('GET'); // Verify request method
    req.flush(mockItem); // Respond with the mock item
  });

  it('should create an item successfully', () => {
    const newItem: Item = {
      id: 3,
      name: 'Item 3',
      dateOfBirth: '',
      gender: '',
      emailId: '',
      phoneNumbers: []
    };

    service.createItem(newItem).subscribe(item => {
      expect(item).toEqual(newItem);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/createItem`); // Expect a request to the URL for creating an item
    expect(req.request.method).toEqual('POST'); // Verify request method
    expect(req.request.body).toEqual(newItem); // Verify the request body
    req.flush(newItem); // Respond with the newly created item
  });
});



// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpClientTestingModule and HttpTestingController
// import { ItemService } from './item.service';
// import { Item } from './models/item.model'; // Import Item model

// describe('ItemService', () => {
//   let service: ItemService;
//   let httpTestingController: HttpTestingController; // Declare HttpTestingController

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule] // Add HttpClientTestingModule here
//     });
//     service = TestBed.inject(ItemService);
//     httpTestingController = TestBed.inject(HttpTestingController); // Inject HttpTestingController
//   });

//   afterEach(() => {
//     httpTestingController.verify(); // Verify that no unmatched requests are outstanding
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should fetch items successfully', () => {
//     const mockItems: Item[] = [
//       {
//         id: 1,
//         name: 'Item 1',
//         dateOfBirth: '',
//         gender: '',
//         emailId: '',
//         phoneNumbers: []
//       },
//       {
//         id: 2,
//         name: 'Item 2',
//         dateOfBirth: '',
//         gender: '',
//         emailId: '',
//         phoneNumbers: []
//       },
//     ];

//     service.getItems().subscribe(items => {
//       expect(items.length).toBe(2);
//       expect(items).toEqual(mockItems);
//     });

//     const req = httpTestingController.expectOne(`${service['apiUrl']}/getAllItems`); // Expect a single request to the URL
//     expect(req.request.method).toEqual('GET'); // Verify request method
//     req.flush(mockItems); // Respond with mock items
//   });

//   it('should fetch an item by ID successfully', () => {
//     const mockItem: Item = {
//       id: 1,
//       name: 'Item 1',
//       dateOfBirth: '',
//       gender: '',
//       emailId: '',
//       phoneNumbers: []
//     };

//     const itemId = 1; // The ID of the item we want to fetch

//     service.getItemById(itemId).subscribe(item => {
//       expect(item).toEqual(mockItem);
//     });

//     const req = httpTestingController.expectOne(`${service['apiUrl']}/getItemById/${itemId}`); // Expect a request to the URL with item ID
//     expect(req.request.method).toEqual('GET'); // Verify request method
//     req.flush(mockItem); // Respond with the mock item
//   });

//   it('should create an item successfully', () => {
//     const newItem: Item = {
//       id: 3,
//       name: 'Item 3',
//       dateOfBirth: '',
//       gender: '',
//       emailId: '',
//       phoneNumbers: []
//     };

//     service.createItem(newItem).subscribe(item => {
//       expect(item).toEqual(newItem);
//     });

//     const req = httpTestingController.expectOne(`${service['apiUrl']}/createItem`); // Expect a request to the URL for creating an item
//     expect(req.request.method).toEqual('POST'); // Verify request method
//     expect(req.request.body).toEqual(newItem); // Verify the request body
//     req.flush(newItem); // Respond with the newly created item
//   });

//   it('should update an item successfully', () => {
//     const updatedItem: Item = {
//       id: 1,
//       name: 'Updated Item',
//       dateOfBirth: '',
//       gender: '',
//       emailId: '',
//       phoneNumbers: []
//     };

//     const itemId = 1; // The ID of the item to update

//     service.updateItem(itemId, updatedItem).subscribe(item => {
//       expect(item).toEqual(updatedItem);
//     });

//     const req = httpTestingController.expectOne(`${service['apiUrl']}/updateItem/${itemId}`); // Expect a request to the URL for updating the item
//     expect(req.request.method).toEqual('PUT'); // Verify request method
//     expect(req.request.body).toEqual(updatedItem); // Verify the request body
//     req.flush(updatedItem); // Respond with the updated item
//   });
// });
