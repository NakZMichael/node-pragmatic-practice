import { Photo } from './models/photo';

const config: any =  {
  app:{
    server:{
      host:'localhost',
      port:3030,
      api:{
        root:'/api/v1',
        customer:{
          api:'/customer'
        },
        photo:{
          api:'/photo'
        }
      }
    },
    db:{
      type: 'mysql' as const,
      host: 'test_node_db',
      port: 3306,
      username: 'test_node_user',
      password: 'test_node_password',
      database: 'test_node_db',
      synchronize: true,
      entities: [
        Photo
      ],
      logging: false,
    },
  },
  test:{
    db:{
      type: 'mysql' as const,
      host: 'test_node_db',
      port: 3306,
      username: 'test_node_user',
      password: 'test_node_password',
      database: 'test_node_db',
      synchronize: true,
      entities: [
        Photo
      ],
      logging: false,
      dropSchema: true, 
    }
  }
};



export default config;