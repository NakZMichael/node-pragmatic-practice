import { Customer } from './customer';

describe('Test the constructor of Customer class', () => {
  describe('It should create a valid object,',() => {
    test('a customer name should equals to the first argument of constructor', async () => {
      const customer = new Customer('NakZ');
      expect(customer.name).toBe('NakZ');
    });
  });
});