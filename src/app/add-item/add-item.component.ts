// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { DataService } from '../data.service';
// import { ItemService } from '../item.service';
// import { NgForm } from '@angular/forms'; // Import NgForm
// import { Item } from '../models/item.model';
// import { AlertService } from '../alert.service';
// import { PhoneNumber } from '../models/phone-number.model';
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-add-item',
//   templateUrl: './add-item.component.html',
//   styleUrls: ['./add-item.component.css']
// })
// export class AddItemComponent implements OnInit {
//   items: Item[] = [];
//   name: string = '';
//   dob: string = '';
//   gender: string = '';
//   email: string = '';
//   phoneNumber: string[] = [''];
//   editIndex: number | null = null;

//   constructor(private dataService: DataService,public authService: AuthService, private router: Router, private route: ActivatedRoute, private itemService: ItemService, private alertService: AlertService) {}

//   async ngOnInit(): Promise<void> {
//     this.route.queryParams.subscribe(async params => {
//       if (params['index']) {
//         this.editIndex = +params['index'];
//         this.itemService.getItems().subscribe(items => {
//           this.items = items;
//         });
//         const item = this.items[this.editIndex];
//         // const items = await this.dataService.getItems();
//         // const item = items[this.editIndex];
//         this.name = item.name;
//         // this.dob = item.dob; 
//         this.dob = item.dateOfBirth; 
//         this.gender = item.gender;
//         // this.email = item.email;
//         this.email = item.emailId;
//         // this.phoneNumber = [...item.phoneNumber];
//         this.phoneNumber = item.phoneNumbers.map(phone => phone.number);
//       }
//     });
//   }

//   addPhoneNumberField() {
//     this.phoneNumber.push('');
//   }

//   removePhoneNumberField(index: number) {
//     this.phoneNumber.splice(index, 1);
//   }

//   validateEmail(email: string): boolean {
//     const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//     return regex.test(email);
//   }

//   validatePhoneNumbers(phoneNumbers: string[]): boolean {
//     const phoneRegex = /^\d{10}$/;
//     return phoneNumbers.every(phone => phoneRegex.test(phone));
//   }

//   async saveItem(form: NgForm) {
//     if (form.invalid) {
//       console.error('Form is invalid');
//       this.alertService.error('Please fill out all fields correctly.');
//       return;
//     }

//     if (!this.validateEmail(this.email)) {
//       console.error('Invalid email:', this.email);
//       this.alertService.error('Email must end with @gmail.com');
//       return;
//     }

//     if (!this.validatePhoneNumbers(this.phoneNumber)) {
//       console.error('Invalid phone numbers:', this.phoneNumber);
//       this.alertService.error('All phone numbers must be exactly 10 digits long.');
//       return;
//     }

//     const item = {
//       name: this.name,
//       dob: this.dob,
//       gender: this.gender,
//       email: this.email,
//       phoneNumber: this.phoneNumber
//     };

    
//     console.log('Submitting item:', item); 

//     if (this.authService.hasRole('ADMIN')) {
//     try {
//       if (this.editIndex !== null && this.editIndex >= 0) {
//         console.log('Updating item at index:', this.editIndex);
//         await this.dataService.updateItem(this.editIndex, item);
//         console.log('Item updated successfully');
//       } else {
//         console.log('Creating new item');
//         //await this.dataService.addItem(item);
//         // const phoneNumber: PhoneNumber =
//         //   {
//         //     number: "9087654321"
//         //   }
//           const mapPhone = this.phoneNumber.map(phnNumber=>({
//               number: phnNumber
//           }));
//             console.log(mapPhone);

//        const newItem:Item= {
//          name: this.name,
//          dateOfBirth:this.dob,
//          gender:this.gender,
//          emailId: this.email,
//          phoneNumbers:mapPhone
//        }
//         await this.itemService.createItem(newItem).toPromise();
//         console.log('Item created successfully');
//       }
//       this.router.navigate(['/list-items']);
//     }
    
    
    
//     catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Error occurred:', error.message)
//         this.alertService.error(error.message); 
//       } else {
//         console.error('An unknown error occurred');
//         this.alertService.error('An unknown error occurred.'); 
//       }
//     }
//   } else {
//     this.alertService.error('Access denied.');
//   }
// }
// }


import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ItemService } from '../item.service';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';
import { Item } from '../models/item.model';

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
    public authService: AuthService
  ) {}

  // async ngOnInit(): Promise<void> {
  //   this.route.queryParams.subscribe(async params => {
  //     if (params['index']) {
  //       this.editIndex = +params['index'];
  //       try {
  //         const item = await this.itemService.getItemById(this.editIndex).toPromise();
  //         if (item) {
  //           this.populateForm(item);
  //         } else {
  //           console.error('Item not found');
  //           this.alertService.error('Item details not found.');
  //           this.router.navigate(['/list-items']);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching item:', error);
  //         this.alertService.error('Failed to load item details.');
  //         this.router.navigate(['/list-items']);
  //       }
  //     }
  //   });
  // }
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      if (params['index']) {
        this.editIndex = +params['index'];
        this.itemService.getItemById(this.editIndex).subscribe(item => {
          if (item) {
            this.name = item.name;
            this.dob = item.dateOfBirth;
            this.gender = item.gender;
            this.email = item.emailId;
            this.phoneNumber = item.phoneNumbers.map(phone => phone.number);
          }
        });
      }
    });
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

  async saveItem(form: NgForm) {
    if (form.invalid) {
      console.error('Form is invalid');
      this.alertService.error('Please fill out all fields correctly.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      console.error('Invalid email:', this.email);
      this.alertService.error('Email must end with @gmail.com');
      return;
    }

    if (!this.validatePhoneNumbers(this.phoneNumber)) {
      console.error('Invalid phone numbers:', this.phoneNumber);
      this.alertService.error('All phone numbers must be exactly 10 digits long.');
      return;
    }

    const item: Item = {
      // id: this.id,
      name: this.name,
      dateOfBirth: this.dob,
      gender: this.gender,
      emailId: this.email,
      phoneNumbers: this.phoneNumber.map(number => ({ number }))
    };

    try {
      if (this.editIndex !== null && this.editIndex >= 0) {
        await this.itemService.updateItem(this.editIndex, item).toPromise();
        console.log('Item updated successfully');
      } else {
        await this.itemService.createItem(item).toPromise();
        console.log('Item created successfully');
      }
      this.router.navigate(['/list-items']);
    } catch (error) {
      console.error('Error occurred:', error);
      this.alertService.error('An error occurred while saving the item.');
    }
  }
}
