import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ItemService } from '../item.service';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service'; // Import UserService
import { Item } from '../models/item.model';
import { LoaderService } from '../loader.service'; 

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  id?: number;
  name: string = '';
  dob: string = '';
  gender: string = '';
  email: string = '';
  phoneNumber: string[] = [''];
  editIndex: number | null = null;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public authService: AuthService,
    private userService: UserService, // Inject UserService
    private loaderService: LoaderService
  ) {}

  // async ngOnInit(): Promise<void> {
  //   this.route.queryParams.subscribe(async params => {
  //     // Use id from params to fetch item instead of index
  //     if (params['id']) {
  //       this.id = +params['id'];
  //       this.loadItem(this.id);  // Load item by id
  //     }
  //   });

  //   // Fetch user roles during initialization
  //   this.userService.getUserRole().subscribe(roles => {
  //     console.log('User Roles:', roles); // Log user roles for debugging
  //     if (roles.includes('ADMIN')) {
  //       console.log('Admin user detected');
  //     }
  //   });
  // }


  ngOnInit(): void {
    // Check if we have an 'id' in the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // If an ID is present, fetch the item data
      this.editIndex = +id;
      this.itemService.getItemById(this.editIndex).subscribe(item => {
        this.name = item.name;
        this.dob = item.dateOfBirth;
        this.gender = item.gender;
        this.email = item.emailId;
        this.phoneNumber = item.phoneNumbers.map(pn => pn.number);
      });
    }
  }
  
  private loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe(
      item => {
        if (item) {
          this.populateForm(item);
        }
      },
      error => {
        console.error('Error loading item:', error);
        this.alertService.error('Unable to load item details.');
      }
    );
  }

 
  private populateForm(item: Item): void {
    this.name = item.name;
    this.dob = item.dateOfBirth;
    this.gender = item.gender;
    this.email = item.emailId;
    this.phoneNumber = item.phoneNumbers.map(phone => phone.number);
  }

  addPhoneNumberField() {
    this.phoneNumber.push('');
  }

  removePhoneNumberField(index: number) {
    if (this.phoneNumber.length > 1) {
      this.phoneNumber.splice(index, 1);
    }
  }

  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  }

  validatePhoneNumbers(phoneNumbers: string[]): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneNumbers.every(phone => phoneRegex.test(phone));
  }

  // async saveItem(form: NgForm) {
  //   this.loaderService.show(); // Show loader
  //   if (form.invalid) {
  //     this.loaderService.hide(); // Hide loader if invalid
  //     console.error('Form is invalid');
  //     this.alertService.error('Please fill out all fields correctly.');
  //     return;
  //   }

  //   if (!this.validateEmail(this.email)) {
  //     console.error('Invalid email:', this.email);
  //     this.alertService.error('Email must end with @gmail.com');
  //     return;
  //   }

  //   if (!this.validatePhoneNumbers(this.phoneNumber)) {
  //     console.error('Invalid phone numbers:', this.phoneNumber);
  //     this.alertService.error('All phone numbers must be exactly 10 digits long.');
  //     return;
  //   }

  //   const item: Item = {
  //     name: this.name,
  //     dateOfBirth: this.dob,
  //     gender: this.gender,
  //     emailId: this.email,
  //     phoneNumbers: this.phoneNumber.map(number => ({ number })),
  //     dob: undefined,
  //     email: undefined,
  //     phoneNumber: undefined
  //   };

  //   try {
  //     if (this.id) {
  //       await this.itemService.updateItem(this.id, item).toPromise();
  //       console.log('Item updated successfully');
  //     } else {
  //       await this.itemService.createItem(item).toPromise();
  //       console.log('Item created successfully');
  //     }
  //     this.router.navigate(['/list-items']);
  //   } catch (error) {
  //     console.error('Error occurred:', error);
  //     this.alertService.error('An error occurred while saving the item.');
  //   } finally {
  //     this.loaderService.hide(); // Hide loader in finally block
  // }
  // }

  saveItem(): void {
    const updatedItem: Item = {
      id: this.editIndex,
      name: this.name,
      dateOfBirth: this.dob,
      gender: this.gender,
      emailId: this.email,
      phoneNumbers: this.phoneNumber.map(pn => ({ number: pn })),
      dob: undefined,
      email: undefined,
      phoneNumber: undefined
    };

    if (this.editIndex !== null) {
      this.itemService.updateItem(this.editIndex, updatedItem).subscribe(() => {
        this.router.navigate(['/list-items']); // Redirect back to the list after saving
      });
    } else {
      // Handle the case when it's a new item creation
      this.itemService.createItem(updatedItem).subscribe(() => {
        this.router.navigate(['/list-items']); // Redirect back to the list after creating
      });
    }
  }
}


