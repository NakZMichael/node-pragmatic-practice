import request from 'supertest';
import { app } from './app';

describe('Test the root path', () => {
  describe('It should response the GET method,',() => {
    test('Status code should be 200', async () => {
      // Act
      const response = await request(app).get('/');
      // Assertion
      expect(response.statusCode).toBe(200);
    });
    test('text  should be Hello World!', async () => {
      // Act
      const response = await request(app).get('/');
      // Assertion
      expect(response.text).toBe('Hello World!');
    });
  });
});