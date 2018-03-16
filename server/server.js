const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const{ mongoose} = require('./db/mongoose.js');
const {Todo} = require('./model/todo.js');

const {User} = require('./model/user.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save()
  .then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.status(200).send({todos})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req,res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send("ID is not invalid");
  } else {
    Todo.findById(id)
      .then((todo) => {
        if(!todo){
          throw new Error('ID is not found');
        }
        return res.status(200).send({todo});
      })
      .catch(e => {
          console.log(e);
          return res.status(404).send(e);
      });
  }
})

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

app.delete('/todos/:id', (req, res) => {
  //get the id
  const id = req.params.id;
  // validate the id  -> return 404
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Not found');
  }
  // remove todo by id
  Todo.findByIdAndRemove(id)
    .then((todo)=>{
      if(!todo) {
        return res.status(404).send('Not found');
      }
      return res.status(200).send({todo});
    })
    .catch(e => res.status(400).send(e));

});

module.exports = {
  app
}
