require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const _ = require('lodash');

const {ObjectID} = require('mongodb');

const{ mongoose} = require('./db/mongoose.js');
const {Todo} = require('./model/todo.js');

const {User} = require('./model/user.js');
const {authenticate} = require('./middleware/authenticate.js');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//Todo API
app.post('/todos',authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save()
  .then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos',authenticate, (req,res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.status(200).send({todos})
  }, (e) => {
    res.status(400).send(e)
  });
})

app.get('/todos/:id',authenticate, (req,res) => {
  const _id = req.params.id;
  const _creator = req.user._id;
  if(!ObjectID.isValid(_id)){
    return res.status(400).send("ID is not invalid");
  } else {
    Todo.findOne({_id, _creator})
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

app.delete('/todos/:id',authenticate, (req, res) => {
  //get the id
  const _id = req.params.id;
  const _creator = req.user.id;
  // validate the id  -> return 404
  if(!ObjectID.isValid(_id)){
    return res.status(404).send('Not found');
  }
  // remove todo by id
  Todo.findOneAndRemove({_id, _creator})
    .then((todo)=>{
      if(!todo) {
        return res.status(404).send('Not found');
      }
      return res.status(200).send({todo});
    })
    .catch(e => res.status(400).send(e));

});

app.patch('/todos/:id',authenticate, (req, res) => {
  let _id = req.params.id;
  let _creator = req.user._id
  let body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(_id)){
    return res.status(404).send('Not found');
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id, _creator}, {$set: body}, {new: true})
    .then((todo) => {
      if(!todo){
        return res.status(404).send() ;
      }
        return res.status(200).send({todo});
    })
    .catch(e => res.status(400).send());

});

// Login API
app.post('/users/login', (req,res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user =>{
      return user.generateAuthToken()
        .then(token => res.status(200).header('x-auth', token).send(user))
    })
    .catch(e => res.status(400).send());
})

//SignUp API
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);
  user.save()
    .then(() => user.generateAuthToken())
    .then(token => res.status(200).header('x-auth', token).send(user))
    .catch(e => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//Logout API
app.delete('/user/me/token',authenticate, (req, res) => {
    req.user.removeToken(req.token)
      .then(() => {
        res.status(200).send();
      })
      .catch(e => res.status(400).send())
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

module.exports = { app };
