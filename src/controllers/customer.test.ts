import request from 'supertest';
import { customerHandler } from './customer';
import config from '../config';

const path = config.app.host + config.app.port + config.app.customer.api;

describe('Test the /api/v1/customer path', () => {
  describe('It should response the GET method,',() => {
    test('Status code should be 200', async () => {
      const response = await request(customerHandler).get(path);
      expect(response.statusCode).toBe(200);
    });
    test('body  should be \'\'', async () => {
      const response = await request(customerHandler).get(path);
      expect(response).toBe({ 'name':'' });
    });
  });
});