import request from 'supertest';
import { app } from './app';

describe('Test the root path', () => {
  describe('It should response the GET method,',() => {
    test('Status code should be 200', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
    });
    test('text  should be Hello World!', async () => {
      const response = await request(app).get('/');
      expect(response.text).toBe('Hello World!');
    });
  });
});