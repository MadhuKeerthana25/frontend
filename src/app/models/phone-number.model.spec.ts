import { PhoneNumber } from './phone-number.model';

describe('PhoneNumber', () => {
  it('should create an object conforming to PhoneNumber interface', () => {
    const phoneNumber: PhoneNumber = {
      number: '1234567890' // Only include known properties from the PhoneNumber interface
    };
    expect(phoneNumber).toBeTruthy();
  });

  // Add more tests related to PhoneNumber's properties and methods here
});
