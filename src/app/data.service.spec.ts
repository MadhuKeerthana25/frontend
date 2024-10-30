// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { DataService } from './data.service';

// describe('DataService', () => {
//   let service: DataService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule]
//     });
//     service = TestBed.inject(DataService);
//     httpMock = TestBed.inject(HttpTestingController);

//     // Mock the constructor-initiated call to fetchItems
//     const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
//     req.flush([]); // Respond with an empty array to complete constructor's fetch
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should fetch items successfully from getItems', () => {
//     const mockItems = [
//       { name: 'John Doe', dob: '1990-01-01', gender: 'Male', email: 'johndoe@example.com', phoneNumber: ['1234567890'] }
//     ];

//     service.getItems().subscribe(items => {
//       expect(items).toEqual(mockItems);
//     });

//     const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockItems); // Simulate a successful response
//   });

//   it('should handle error in getItems', () => {
//     service.getItems().subscribe(items => {
//       expect(items).toEqual([]); // Expect an empty array on error
//     });

//     const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
//     expect(req.request.method).toBe('GET');
//     req.error(new ErrorEvent('Network error')); // Simulate an error response
//   });

//   it('should handle error in fetchItems', () => {
//     service['fetchItems']();

//     const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
//     expect(req.request.method).toBe('GET');
//     req.error(new ErrorEvent('Network error'));

//     service.items$.subscribe(items => {
//       expect(items).toEqual([]); // Expect the items to be empty after the error
//     });
//   });

//   it('should check for duplicate emails', () => {
//     service['items'] = [
//       { name: 'Jane Doe', dob: '1992-02-02', gender: 'Female', email: 'janedoe@example.com', phoneNumber: ['0987654321'] }
//     ];

//     expect(service['isEmailDuplicate']('janedoe@example.com', null)).toBeTrue();
//     expect(service['isEmailDuplicate']('johndoe@example.com', null)).toBeFalse();
//     expect(service['isEmailDuplicate']('janedoe@example.com', 0)).toBeFalse();
//   });

//   it('should handle error in addItem', () => {
//     const newItem = { 
//       name: 'Alice Smith', 
//       dob: '1985-05-05', 
//       gender: 'Female', 
//       email: 'alice@example.com', 
//       phoneNumber: ['1234567890'] 
//     };
  
//     service.addItem(newItem).subscribe({
//       next: () => {
//         fail('Expected an error, but the operation was successful.');
//       },
//       error: (error) => {
//         expect(error).toBeUndefined();
//       }
//     });
  
//     const req = httpMock.expectOne(`${service['apiUrl']}/createItem`);
//     expect(req.request.method).toBe('POST');
//     expect(req.request.body).toEqual(newItem);
//     req.error(new ErrorEvent('Network error'));
//   });

//   it('should delete an item successfully', () => {
//     const itemId = 1;

//     service.deleteItem(itemId).subscribe({
//       next: () => {
//         expect(true).toBeTrue(); // If delete is successful, expect this to be true
//       },
//       error: () => {
//         fail('Expected successful deletion, but an error occurred.');
//       }
//     });

//     const deleteReq = httpMock.expectOne(`${service['apiUrl']}/deleteItem/${itemId}`);
//     expect(deleteReq.request.method).toBe('DELETE');
//     deleteReq.flush(null); // Simulate successful deletion

//     // Mock the fetchItems call after delete
//     const fetchReq = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
//     expect(fetchReq.request.method).toBe('GET');
//     fetchReq.flush([]); // Respond with an empty array
//   });

//   it('should handle error in deleteItem', () => {
//     const itemId = 1;

//     service.deleteItem(itemId).subscribe({
//       next: () => {
//         fail('Expected an error, but the operation was successful.');
//       },
//       error: (error) => {
//         expect(error).toBeUndefined();
//       }
//     });

//     const req = httpMock.expectOne(`${service['apiUrl']}/deleteItem/${itemId}`);
//     expect(req.request.method).toBe('DELETE');
//     req.error(new ErrorEvent('Network error')); // Simulate an error response
//   });

//   // New test case for deleteItemsInBulk (success and error scenarios)
//   it('should delete multiple items in bulk successfully', () => {
//     const itemIds = [1, 2, 3];

//     service.deleteItemsInBulk(itemIds).subscribe({
//       next: () => {
//         expect(true).toBeTrue(); // Expect successful bulk deletion
//       },
//       error: () => {
//         fail('Expected successful bulk deletion, but an error occurred.');
//       }
//     });

//     const req = httpMock.expectOne(`${service['apiUrl']}/deleteItems`);
//     expect(req.request.method).toBe('DELETE');
//     expect(req.request.body).toEqual(itemIds); // Ensure the correct IDs are sent
//     req.flush(null); // Simulate successful bulk deletion

//     // Mock the fetchItems call after bulk delete
//     const fetchReq = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
//     expect(fetchReq.request.method).toBe('GET');
//     fetchReq.flush([]); // Respond with an empty array
//   });

//   it('should handle error in deleteItemsInBulk', () => {
//     const itemIds = [1, 2, 3];

//     service.deleteItemsInBulk(itemIds).subscribe({
//       next: () => {
//         fail('Expected an error, but the operation was successful.');
//       },
//       error: (error) => {
//         expect(error).toBeUndefined();
//       }
//     });

//     const req = httpMock.expectOne(`${service['apiUrl']}/deleteItems`);
//     expect(req.request.method).toBe('DELETE');
//     expect(req.request.body).toEqual(itemIds); // Ensure the correct IDs are sent
//     req.error(new ErrorEvent('Network error')); // Simulate an error response
//   });
// });


import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock the constructor-initiated call to fetchItems
    const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
    req.flush([]); // Respond with an empty array to complete constructor's fetch
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items successfully from getItems', () => {
    const mockItems = [
      { name: 'John Doe', dob: '1990-01-01', gender: 'Male', email: 'johndoe@example.com', phoneNumber: ['1234567890'] }
    ];

    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems); // Simulate a successful response
  });

  it('should handle error in getItems', () => {
    service.getItems().subscribe(items => {
      expect(items).toEqual([]); // Expect an empty array on error
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error')); // Simulate an error response
  });

  it('should handle error in fetchItems', () => {
    service['fetchItems']();

    const req = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));

    service.items$.subscribe(items => {
      expect(items).toEqual([]); // Expect the items to be empty after the error
    });
  });

  it('should check for duplicate emails', () => {
    service['items'] = [
      { name: 'Jane Doe', dob: '1992-02-02', gender: 'Female', email: 'janedoe@example.com', phoneNumber: ['0987654321'] }
    ];

    expect(service['isEmailDuplicate']('janedoe@example.com', null)).toBeTrue();
    expect(service['isEmailDuplicate']('johndoe@example.com', null)).toBeFalse();
    expect(service['isEmailDuplicate']('janedoe@example.com', 0)).toBeFalse();
  });

  it('should handle error in addItem', () => {
    const newItem = { 
      name: 'Alice Smith', 
      dob: '1985-05-05', 
      gender: 'Female', 
      email: 'alice@example.com', 
      phoneNumber: ['1234567890'] 
    };
  
    service.addItem(newItem).subscribe({
      next: () => {
        fail('Expected an error, but the operation was successful.');
      },
      error: (error) => {
        expect(error).toBeUndefined();
      }
    });
  
    const req = httpMock.expectOne(`${service['apiUrl']}/createItem`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.error(new ErrorEvent('Network error'));
  });

  it('should delete an item successfully', () => {
    const itemId = 1;

    service.deleteItem(itemId).subscribe({
      next: () => {
        expect(true).toBeTrue(); // If delete is successful, expect this to be true
      },
      error: () => {
        fail('Expected successful deletion, but an error occurred.');
      }
    });

    const deleteReq = httpMock.expectOne(`${service['apiUrl']}/deleteItem/${itemId}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null); // Simulate successful deletion

    // Mock the fetchItems call after delete
    const fetchReq = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
    expect(fetchReq.request.method).toBe('GET');
    fetchReq.flush([]); // Respond with an empty array
  });

  it('should handle error in deleteItem', () => {
    const itemId = 1;

    service.deleteItem(itemId).subscribe({
      next: () => {
        fail('Expected an error, but the operation was successful.');
      },
      error: (error) => {
        expect(error).toBeUndefined();
      }
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deleteItem/${itemId}`);
    expect(req.request.method).toBe('DELETE');
    req.error(new ErrorEvent('Network error')); // Simulate an error response
  });

  // New test case for deleteItemsInBulk (success and error scenarios)
  it('should delete multiple items in bulk successfully', () => {
    const itemIds = [1, 2, 3];

    service.deleteItemsInBulk(itemIds).subscribe({
      next: () => {
        expect(true).toBeTrue(); // Expect successful bulk deletion
      },
      error: () => {
        fail('Expected successful bulk deletion, but an error occurred.');
      }
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deleteItems`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(itemIds); // Ensure the correct IDs are sent
    req.flush(null); // Simulate successful bulk deletion

    // Mock the fetchItems call after bulk delete
    const fetchReq = httpMock.expectOne(`${service['apiUrl']}/getAllItems`);
    expect(fetchReq.request.method).toBe('GET');
    fetchReq.flush([]); // Respond with an empty array
  });

  it('should handle error in deleteItemsInBulk', () => {
    const itemIds = [1, 2, 3];

    service.deleteItemsInBulk(itemIds).subscribe({
      next: () => {
        fail('Expected an error, but the operation was successful.');
      },
      error: (error) => {
        expect(error).toBeUndefined();
      }
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deleteItems`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(itemIds); // Ensure the correct IDs are sent
    req.error(new ErrorEvent('Network error')); // Simulate an error response
  });

  // New test cases for updateItem method

  it('should throw an error when updating an item with a duplicate email', async () => {
    service['items'] = [
      { name: 'Jane Doe', dob: '1992-02-02', gender: 'Female', email: 'janedoe@example.com', phoneNumber: ['0987654321'] }
    ];

    const duplicateItem = { 
      name: 'Jane Doe', 
      dob: '1992-02-02', 
      gender: 'Female', 
      email: 'janedoe@example.com', 
      phoneNumber: ['0987654321'] 
    };

    await expectAsync(service.updateItem(1, duplicateItem)).toBeRejectedWithError('An item with this email already exists.');
  });

  it('should update an item successfully when there is no duplicate email', async () => {
    service['items'] = [
      { name: 'Jane Doe', dob: '1992-02-02', gender: 'Female', email: 'janedoe@example.com', phoneNumber: ['0987654321'] }
    ];

    const updatedItem = { 
      name: 'John Doe', 
      dob: '1990-01-01', 
      gender: 'Male', 
      email: 'johndoe@example.com', 
      phoneNumber: ['1234567890'] 
    };

    await service.updateItem(0, updatedItem);
    expect(service['items'][0]).toEqual(updatedItem);
  });
});
