const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, client) => {
  if(error){
    return console.log('Unable to connect to server');
  }

  const db = client.db('TodoApp');
  db.collection('TestMongo').find({
    _id: new ObjectID('5aa5fa9944151a0b84c18ac6')

  }).toArray().then((docs) => {
    console.log('TestMongo');
    console.log(JSON.stringify(docs,undefined,2));
  }, (err) => {
    if(err) {
      console.log('Unable to fetch todos', err);
    }
  });

  client.close();
});
