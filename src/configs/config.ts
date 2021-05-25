import objectPath from 'object-path';
import fs from 'fs';
import { IConfigData, IFormatStrategy } from './types';



export class Config {
  data: IConfigData
  formatStrategy: IFormatStrategy
  constructor(formatStrategy: IFormatStrategy){
    this.data = {};
    this.formatStrategy = formatStrategy;
  }
  get = (configPath: string): string|number|IConfigData => {
    return objectPath.get(this.data, configPath);
  }
  set = (configPath: string, value: string|number|IConfigData) => {
    return objectPath.set(this.data, configPath, value);
  }
  load = async(filePath: string) => {
    console.log(`Seserializing from ${filePath}`);
    this.data = this.formatStrategy.deserialize(
      await fs.promises.readFile(filePath, 'utf-8')
    );
  }
  save = async(filePath: string) => {
    console.log(`Serializeing to ${filePath}`);
    await fs.promises.writeFile(filePath, this.formatStrategy.serialize(this.data));
  }
}