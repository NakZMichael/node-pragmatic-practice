export interface IFormatStrategy{
  deserialize: (data: string) => IConfigData
  serialize: (data: IConfigData) => string
}
export interface IConfigData{
  [property: string]: string|number|IConfigData
}