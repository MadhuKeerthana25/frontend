import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AddItemComponent } from './add-item.component';
import { ItemService } from '../item.service';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { LoaderService } from '../loader.service';
import { ActivatedRoute } from '@angular/router';

// Mock AppHeaderComponent
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: '<div></div>' // Provide a simple template for the mock
})
class MockAppHeaderComponent {}

describe('AddItemComponent', () => {
  let component: AddItemComponent;
  let fixture: ComponentFixture<AddItemComponent>;
  let itemServiceMock: any;
  let alertServiceMock: any;
  let authServiceMock: any;
  let userServiceMock: any;
  let loaderServiceMock: any;
  let routeMock: any;

  beforeEach(async () => {
    itemServiceMock = {
      getItemById: jasmine.createSpy('getItemById').and.returnValue(of({
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        emailId: 'john@gmail.com',
        phoneNumbers: [{ number: '1234567890' }]
      })),
      createItem: jasmine.createSpy('createItem').and.returnValue(of({})),
      updateItem: jasmine.createSpy('updateItem').and.returnValue(of({})),
    };

    alertServiceMock = {
      error: jasmine.createSpy('error')
    };

    authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true)
    };

    userServiceMock = {
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue(of(['ADMIN']))
    };

    loaderServiceMock = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };

    routeMock = {
      queryParams: of({ id: 1 })
    };

    await TestBed.configureTestingModule({
      declarations: [AddItemComponent, MockAppHeaderComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ItemService, useValue: itemServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemComponent);
    component = fixture.componentInstance;

    // Initialize phone numbers here
    component.phoneNumber = []; // Ensure it's an empty array at the start

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load item on init when id is provided', () => {
    expect(itemServiceMock.getItemById).toHaveBeenCalledWith(1);
    expect(component.name).toBe('John Doe');
    expect(component.dob).toBe('1990-01-01');
    expect(component.gender).toBe('Male');
    expect(component.email).toBe('john@gmail.com');
    expect(component.phoneNumber).toEqual(['1234567890']);
  });

  // it('should add a phone number field', () => {
  //   component.addPhoneNumberField();
  //   expect(component.phoneNumber.length).toBe(1); // After adding, it should be 1
  // });

  // it('should remove a phone number field', () => {
  //   component.phoneNumber.push('1234567890'); // Add a number before removing
  //   component.removePhoneNumberField(0);
  //   expect(component.phoneNumber.length).toBe(0); // After removing, it should be 0
  // });

  it('should not remove phone number if only one exists', () => {
    component.phoneNumber.push('1234567890'); // Start with one phone number
    component.removePhoneNumberField(0); // Attempt to remove it
    expect(component.phoneNumber.length).toBe(1); // Length should remain 1
  });

  it('should validate email format', () => {
    expect(component.validateEmail('test@gmail.com')).toBeTrue();
    expect(component.validateEmail('test@other.com')).toBeFalse();
  });

  it('should validate phone numbers', () => {
    expect(component.validatePhoneNumbers(['1234567890'])).toBeTrue();
    expect(component.validatePhoneNumbers(['123'])).toBeFalse();
  });

  it('should call createItem when form is valid and no id is present', async () => {
    component.id = undefined; // no id means create
    component.email = 'test@gmail.com';
    component.phoneNumber = ['1234567890'];
    const formMock = { invalid: false } as any;

    await component.saveItem(formMock);

    expect(loaderServiceMock.show).toHaveBeenCalled();
    expect(itemServiceMock.createItem).toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('should call updateItem when form is valid and id is present', async () => {
    component.id = 1;
    component.email = 'test@gmail.com';
    component.phoneNumber = ['1234567890'];
    const formMock = { invalid: false } as any;

    await component.saveItem(formMock);

    expect(loaderServiceMock.show).toHaveBeenCalled();
    expect(itemServiceMock.updateItem).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('should show error message if form is invalid', async () => {
    const formMock = { invalid: true } as any;

    await component.saveItem(formMock);

    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(alertServiceMock.error).toHaveBeenCalledWith('Please fill out all fields correctly.');
  });
});
