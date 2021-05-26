import httpMocks from 'node-mocks-http';
import { Connection, createConnection, Repository } from 'typeorm';
import { getPhotoRepository, Photo, PhotoProps } from '../models/photo';
import config from '../config';
import { createPhotoHandler } from './photoController';
import faker from 'faker';

describe('Test createNewPhotoHandler()', () => {
  // create a global connection within this test
  let connection: Connection;
  let repository: Repository<Photo>;
  beforeEach(async () => {
    connection = await createConnection(config.test.db);
    repository = getPhotoRepository(connection);
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
        db:repository,
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
      await createPhotoHandler(request, response, () => {});
      // Assertion
      const fetchedPhoto = await repository.findOne({ userName:userName });
      expect(fetchedPhoto).not.toEqual(undefined);

    });
  });
});