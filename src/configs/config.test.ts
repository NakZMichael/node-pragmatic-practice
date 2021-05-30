import path from 'path';
import { Config } from './config';
import { iniStrategy, jsonStrategy } from './strategies';
import fs from 'fs';

describe('Test Config Class', () => {
  describe('Config#load() load data from varias formatted file', () => {
    test('If the file formatted with INI, it returns the Config object', async() => {
      // Arrange
      const config = new Config(iniStrategy);
      const iniFilePath = path.join(__dirname, 'test-assets', 'iniTest.ini');
      // Act
      await config.load(iniFilePath);
      const configData = config.get('section');
      // Assert
      expect(configData).toEqual({
        a:'a',
        b:'b',
      });
    });
    test('It can convert ini to JSON as follow', async() => {
      // Arrange
      const iniConfig = new Config(iniStrategy);
      const iniFilePath = path.join(__dirname, 'test-assets', 'iniTest.ini');
      
      const jsonConfig = new Config(jsonStrategy);
      const jsonFilePath = path.join(__dirname, 'test-assets', 'jsonTest.json');
      // Act
      await iniConfig.load(iniFilePath);
      const sectionData = iniConfig.get('section');

      jsonConfig.set('section', sectionData);
      await jsonConfig.save(jsonFilePath);
      let jsonString = '';
      jsonString = await fs.promises.readFile(jsonFilePath, 'utf-8');
      let jsonParesed = {}; 
      try{
        jsonParesed= JSON.parse(jsonString);
      }catch(e){
        console.log(e);
        console.log('Invalid JSON String: input =  ', jsonString);
        throw e;
      }

      // Assert
      expect(jsonParesed).toEqual({
        section:{
          a:'a',
          b:'b',
        }
      });
    });
  });
});