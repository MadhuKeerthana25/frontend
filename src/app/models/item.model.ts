import { PhoneNumber } from './phone-number.model';

export interface Item {
  id?: number;
  name: string;
  dateOfBirth: string; // format should be 'YYYY-MM-DD'
  gender: string;
  emailId: string;
  // phoneNumbers: PhoneNumber[];
  phoneNumbers: { number: string }[];
}
