const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');
  const db = client.db('TodoApp');

  //deleteMany
  db.collection('TestMongo')
    .deleteMany({
      text: 'Something to do'
    })
    .then((result) => {
      console.log('Delete Log', result);
    });

  //deleteOne
  db.collection('TestMongo')
    .deleteMany({
      text: 'Something to do'
    })
    .then((result) => {
      console.log('Delete Log', result);
    });
    
  //findOneAndDelete
  db.collection('TestMongo')
    .findOneAndDelete({
      text: 'Something to do'
    })
    .then((result) => {
      console.log('Delete Log', result);
    });

  client.close();
});
