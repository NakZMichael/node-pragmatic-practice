import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { getPhotoRepository, Photo } from './photo';
import { testDB } from '../utils/testUtils/dbConfig';

describe('Test the Photo.create()', () => {

  // create a global connection within this test suite
  let connection: Connection;

  beforeEach(async () => {
    connection = await createConnection(testDB);
  });

  afterEach(async () => {
    try{
      await connection.close();
    }catch{
      return;
    }
  });

  describe('It insert a photo entitiy itself into the database.', () => {
    test(`If it receives the correct parameter set, 
    the photo entity fetched from the database should be equal to it.`, async () => {
      
      // Arrange
      // set up a repository, TypeORM object
      const repository = getPhotoRepository(connection);
      
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        name:'Jean random',
        description:'I am near polar bears',
        filename:'photo-with-bears.jpg',
      });
      
      // Act
      const createdPhoto =  await photo.create();
      const result = await repository.findOne({ name:'Jean random' });
      
      // Assert
      expect(result?.id).toEqual(createdPhoto.id);
    });
  });
  
  describe('It insert a photo entitiy itself into the database.', () => {
    
    test('If the database connection is closed, it should be faild.', async () => {
      
      // Arrange
      // set up a repository, TypeORM object
      const repository = getPhotoRepository(connection);
      
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        name:'Jean random',
        description:'I am near polar bears',
        filename:'photo-with-bears.jpg',
      });
  
      // Act
      await photo.create();
      const result = await repository.findOne({ name:'Jean random' });
      
      await connection.close();
      // Assert
      try{
        await result?.create();
      }catch{
        // nothing to do,it is alright!
        return;
      }
      fail(new Error('Error was not thrown unless connection is closed'));
    });
  });
  
  describe('When it is fetched', () => {
    test('It is should set a repository to the field db', async () => {

      // Arrange
      // set up a repository, TypeORM object
      const repository = getPhotoRepository(connection);
      
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        name:'Jean random1',
        description:'I am near polar bears1',
        filename:'photo-with-bears.jpg1',
        views:0,
      });
      await photo.create();
      const fetchedPhoto = await repository.findOne({ name:'Jean random1' });
      if(!fetchedPhoto){
        fail(new Error('Failed to fetch the photo inserted.'));
      }

      // Act && Assert
      await fetchedPhoto.create();
    });
  });
});