import config from '../config';
import path from 'path';


export function uriGenerator(serviceName: string): string{
  const rootUri = config.app.server.api.root;
  if(!Object.keys(config.app.server.api).includes(serviceName)){
    throw new Error('Recieved service name is invalid');
  }
  const serviceApi: string|{api: string} = config.app.server.api[serviceName];
  if(typeof serviceApi === 'string'){
    return rootUri;
  }else{ 
    return path.join(rootUri, serviceApi.api);
  }
}