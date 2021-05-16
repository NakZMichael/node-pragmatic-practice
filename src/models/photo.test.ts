import 'reflect-metadata';
import { Connection, createConnection, Repository } from 'typeorm';
import { getPhotoRepository, Photo } from './photo';
import { testDB } from '../utils/testUtils/dbConfig';
import faker from 'faker';

// Unit under test
describe('Test the Photo.create()', () => {

  // create a global connection within this test
  let connection: Connection;
  let repository: Repository<Photo>;
  beforeEach(async () => {
    connection = await createConnection(testDB);
    repository = getPhotoRepository(connection);
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
      const photo = new Photo({
        db:repository,
        userName: userName,
        description:description,
        filename:fileName,
        views:1,
      });
      
      // Act
      await photo.create();
      const result = await repository.findOne({ userName:userName });
      
      // Assert
      expect(result?.id).toEqual(photo.id);
    });
    test('If the database connection is closed, it should be faild.', async () => {
      // Arrange
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        userName:'Jean random',
        description:'I am near polar bears',
        filename:'photo-with-bears.jpg',
      });
      await connection.close();
        
      // Act && Assert
      await expect(photo.create).rejects.toThrow();
    });
  });
  

  describe('If it is fetched from database.', () => {
    test('When it try to create(insert) itserlf into the database,it is should throw an error', async () => {

      // Arrange
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        userName:'Jean random1',
        description:'I am near polar bears1',
        filename:'photo-with-bears.jpg1',
        views:0,
      });
      await photo.create();
      const fetchedPhoto = await repository.findOne({ userName:'Jean random1' });
      if(!fetchedPhoto){
        fail(new Error('Failed to fetch the photo inserted.'));
      }
      fetchedPhoto.userName = 'fetched';

      // Act && Assert
      await expect(fetchedPhoto.create).rejects.toThrow();
    });
  });
});

describe('Test the Photo.update()', () => {
  
  // create a global connection within this test
  let connection: Connection;
  let repository: Repository<Photo>;
  beforeEach(async () => {
    connection = await createConnection(testDB);
    repository = getPhotoRepository(connection);
  });
  afterEach(async () => {
    if(connection.isConnected){
      await connection.close();
    }
  });
  
  
  describe('It update a photo entitiy itself fetched from the database.', () => {
    test('It is should set a repository to the field db, so that it can update itself.', async () => {
  
      // Arrange
      // set up a repository, TypeORM object
      const repository = getPhotoRepository(connection);
      
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        userName:'Jean random1',
        description:'I am near polar bears1',
        filename:'photo-with-bears.jpg1',
        views:0,
      });
      await photo.create();
      const fetchedPhoto = await repository.findOne({ userName:'Jean random1' });
      if(!fetchedPhoto){
        fail(new Error('Failed to fetch the photo inserted.'));
      }
      fetchedPhoto.userName = 'fetched';
  
      // Act && Assert
      await expect(fetchedPhoto.update).resolves;
    });
  });
  test('If the database connection is closed, it should be faild.', async () => {
    // Arrange
    // arrange an photo object
    const photo = new Photo({
      db:repository,
      userName:'Jean random',
      description:'I am near polar bears',
      filename:'photo-with-bears.jpg',
    });
      
    // Act
    await photo.create();
    const result = await repository.findOne({ userName:'Jean random' });
      
    await connection.close();
      
    // Assert
    await expect(result?.update).rejects.toThrow();
  });
  test('If the entity doesn\'t have id value,it should fail.', async () => {
    // Arrange
    // arrange an photo object
    const photo = new Photo({
      db:repository,
      userName:'Jean random',
      description:'I am near polar bears',
      filename:'photo-with-bears.jpg',
    });
      
    // Act && Asssert
    await expect(photo.update).rejects.toThrow();
  });
});

describe('Test the Photo.getDbByGetConnection()', () => {
  
  // create a global connection within this test
  let connection: Connection;
  let repository: Repository<Photo>;
  beforeEach(async () => {
    connection = await createConnection(testDB);
    repository = getPhotoRepository(connection);
  });
  afterEach(async () => {
    if(connection.isConnected){
      await connection.close();
    }
  });
  
  describe('When it is fetched, it is set the repository to db field', () => {
    test('It should have a db value', async () => {

      // Arrange
      // arrange an photo object
      const photo = new Photo({
        db:repository,
        userName:'Jean random1',
        description:'I am near polar bears1',
        filename:'photo-with-bears.jpg1',
        views:0,
      });
      await photo.create();
      const fetchedPhoto = await repository.findOne({ userName:'Jean random1' });
      if(!fetchedPhoto){
        fail(new Error('Failed to fetch the photo inserted.'));
      }
      fetchedPhoto.userName = 'fetched';

      // Act && Assert
      expect(fetchedPhoto.db).not.toBe(undefined);
    });
  });
});
