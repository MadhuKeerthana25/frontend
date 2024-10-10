import { Item } from './item.model';

describe('Item', () => {
  it('should create an instance', () => {
    // Replace the properties with those defined in your Item model
    const mockItem: Item = {
      id: 1, // Assuming this property exists
      name: 'Test Item',
      dateOfBirth: '',
      gender: '',
      emailId: '',
      phoneNumbers: []
    };

    expect(mockItem).toBeTruthy();
  });
});
