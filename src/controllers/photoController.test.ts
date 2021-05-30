import httpMocks from 'node-mocks-http';
import { Connection, createConnection, Repository } from 'typeorm';
import { Photo, PhotoProps, PhotoService } from '../photoComponent/photo';
import config from '../config';
import { createPhotoHandler } from './photoController';
import faker from 'faker';
import { AppLogger } from '../logging';

describe('Test createNewPhotoHandler()', () => {
  // create a global connection within this test
  let connection: Connection;
  let repository: Repository<Photo>;
  beforeEach(async () => {
    connection = await createConnection(config.test.db);
    repository = connection.getRepository(Photo);
  });
  afterEach(async () => {
    if(connection.isConnected){
      await connection.close();
    }
  });

  describe('When it recieves request, it create a photo entity', () => {
    test('If the request has the body having a correct set of parameters, a photo entieies should be created', async () => {
      // Arrange
      const userName = faker.name.findName(); 
      const description = faker.lorem.sentence();
      const fileName = faker.system.fileName();
      const body: PhotoProps = {
        userName: userName,
        description:description,
        filename:fileName,
        views:1,
      };
      const  request  = httpMocks.createRequest({
        method: 'GET',
        url: '/user/42',
        body:body,
      });
      const response = httpMocks.createResponse();
      // Act
      await new Promise(resolve => {
        createPhotoHandler(request, response, (err: any) => {
          console.log(err);
          throw err;
        });
        setTimeout(resolve, 3000);
      });

      // Assertion
      const fetchedPhoto = await repository.findOne({ userName:userName });
      expect(fetchedPhoto).not.toEqual(undefined);

    });
  });
});