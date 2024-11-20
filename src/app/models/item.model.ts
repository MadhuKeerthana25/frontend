import { PhoneNumber } from './phone-number.model';

export interface Item {
  dob: any;
  email: any;
  phoneNumber: any;
  id?: number | null;
  name: string;
  dateOfBirth: string; // format should be 'YYYY-MM-DD'
  gender: string;
  emailId: string;
  phoneNumbers: PhoneNumber[];
  // phoneNumbers: { number: string }[];
}

//name: string; dob: string; gender: string; email: string; phoneNumber: string[]; }': dob, email, phoneNumber