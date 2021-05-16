import { ConnectionOptions } from 'typeorm';
import { Photo } from '../../models/photo';

export const testDB: ConnectionOptions =  {
  type: 'mysql',
  host: 'test_node_db',
  port: 3306,
  username: 'test_node_user',
  password: 'test_node_password',
  database: 'test_node_db',
  synchronize: true,
  entities: [
    Photo
  ],
  logging: false,
  dropSchema: true, // Isolate each test case
};