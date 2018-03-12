const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('TestMongo').insertOne({
  //   text: 'Something to do',
  //   complete: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo');
  //   }
  //
  //   console.log(JSON.stringify(result.ops,));
  //
  //   });

  db.collection('Users').insertOne({
    name: 'Thien',
    location: 'Viet Nam'
  }, (err, result) => {
      if(err){
        return console.log('Unable to insert document: ', err);
      }

      console.log(JSON.stringify(result.ops));
  });

  client.close();
});
