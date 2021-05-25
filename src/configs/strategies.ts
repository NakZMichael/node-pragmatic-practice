import ini from 'ini';
import { IFormatStrategy } from './types';

export const iniStrategy: IFormatStrategy = {
  deserialize: data => ini.parse(data),
  serialize: (data) => ini.stringify(data)
};

export const jsonStrategy: IFormatStrategy = {
  deserialize: data => JSON.parse(data),
  serialize: data => JSON.stringify(data, null, ' ')
};
