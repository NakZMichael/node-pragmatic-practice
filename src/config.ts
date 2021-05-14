export default {
  // Example settings.
  // // Customer module configs 
  // "Customer": {
  //   "dbConfig": {
  //     "host": "localhost",
  //     "port": 5984,
  //     "dbName": "customers"
  //   },
  //   "credit": {
  //     "initialLimit": 100,
  //     // Set low for development 
  //     "initialDays": 1
  //   }
  // }
  app:{
    host:'localhost',
    port:3030,
    api:'/api/v1',
    customer:{
      api:'/customer'
    }
  }
};