const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');
  const db = client.db('TodoApp');


  //findOneAndUpdate
  db.collection('TestMongo')
    .findOneAndUpdate({
      _id: new ObjectID("5aa612594a0e03006069380d")
    },{
      $set: {
        complete: "false"
      }
    },{
      returnOriginal: false
    })
    .then((result) => {
      console.log('Update Log', result);
    });

  client.close();
});
