import 'reflect-metadata';
import { Connection, createConnection, Repository } from 'typeorm';
import { Photo, PhotoService } from './photo';
import config from '../config'
;
import faker from 'faker';
import { AppLogger } from '../logging';

// Unit under test
describe('Test the Photo.create()', () => {

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
  //Scenario
  describe('It insert a photo entitiy itself into the database.', () => {
    //Expectation
    test(`If it receives the correct parameter set, 
    the photo entity fetched from the database should be equal to it.`, async () => {

      // Arrange      
      // arrange an photo object
      const userName = faker.name.findName();
      const description = faker.lorem.sentence();
      const fileName = faker.system.fileName();
      const photoService = new PhotoService(connection, new AppLogger());
      
      // Act
      const photo = await photoService.create( {
        userName: userName,
        description:description,
        filename:fileName,
        views:1,
      });
      const result = await repository.findOne({ userName:userName });
      
      // Assert
      expect(result?.id).toEqual(photo.id);
    });
    test('If the database connection is closed, it should be faild.', async () => {
      // Arrange
      // arrange an photo object
      const userName = faker.name.findName();
      const description = faker.lorem.sentence();
      const fileName = faker.system.fileName();
      const photoService = new PhotoService(connection, new AppLogger());
      await connection.close();
        
      // Act && Assert
      await expect(photoService.create({
        userName: userName,
        description:description,
        filename:fileName,
        views:1,
      })).rejects.toThrow();
    });
  });
  

  describe('If it is fetched from database.', () => {
    test('When it try to create(insert) itserlf into the database,it is should throw an error', async () => {

      // Arrange
      // arrange an photo object
      // Arrange      
      // arrange an photo object
      const userName = faker.name.findName();
      const description = faker.lorem.sentence();
      const fileName = faker.system.fileName();
      const photoService = new PhotoService(connection, new AppLogger());
      
      // Act
      const photo = await photoService.create( {
        userName: userName,
        description:description,
        filename:fileName,
        views:1,
      });

      const fetchedPhoto = await repository.findOne({ userName:userName });
      if(!fetchedPhoto){
        fail(new Error('Failed to fetch the photo inserted.'));
      }
      fetchedPhoto.userName = userName;

      // Act && Assert
      await expect(photoService.create(fetchedPhoto)).rejects.toThrow();
    });
  });
});
