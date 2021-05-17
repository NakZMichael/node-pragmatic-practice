import { uriGenerator } from './uriGenerator';

describe('Test uriGenerator()',() => {
  describe('It generate a uri',() => {

    test('When it recieves photo,it should return /api/vi/photo',() => {
      // Arrange && Act
      const generatedUri = uriGenerator('photo');
      // Assert
      expect(generatedUri).toEqual('/api/v1/photo');
    });
    test('When it recieves root,it should return /api/vi',() => {
      // Arrange && Act
      const generatedUri = uriGenerator('root');
      // Assert
      expect(generatedUri).toEqual('/api/v1');
    });
    test('When it recieves a incorrect value ,it should throw an Error',() => {
      // Arrange && Act && Assert
      expect(() => uriGenerator('evilRequest')).toThrow();
    });
  });
});