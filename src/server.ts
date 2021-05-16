import { app } from './app';
import config from './config';

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './models/photo';


createConnection({
  type: 'mysql',
  host: 'node_db',
  port: 3306,
  username: 'node_user',
  password: 'node_password',
  database: 'node_db',
  // url:`${'node_user'}:${'node_password'}@tcp(node_db:3306)/${'node_db'}?charset=utf8mb4&parseTime=True&loc=Local`,
  entities: [
    // うまくいかないので仕方なく手動で読み込む
    // __dirname + '/models/**/*.js'
    Photo
  ],
  synchronize: true,
}).then(async connection => {
  const photo = new Photo({
    db:connection.getRepository(Photo),
    userName:'Me and Bears',
    filename:'photo-with-bears.jpg',
    views:1,
    isPublished:true
  });

  const photoRepository = connection.getRepository(Photo);
  await photoRepository.save(photo);
  console.log('Photo has been saved');

  const savedPhotos = await photoRepository.find();
  console.log('All photos from the db: ', savedPhotos);
  
}).then(
  () => {
    const port = config.app.port;
    app.listen(port, () => {
      console.log(`App listening on port http://localhost:${port} !!`);
    });
  }
).catch(error => console.log(error));