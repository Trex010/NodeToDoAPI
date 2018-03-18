const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/todo');
const {User} = require('./../../model/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const userData = [{
  _id: userOneId,
  email: 'trex1@gmail.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'},'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'trex2@gmail.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'},'abc123').toString()
  }]
}, {
  _id: userThreeId,
  email: 'trex3@gmail.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userThreeId, access: 'auth'},'abc123').toString()
  }]
}]

const todoData = [{
  _id: new ObjectID(),
  text:'First thing'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  complete: false,
  completeAt: 333
}];

const populateTodo = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todoData);
    })
    .then(() => done())
}

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
        let userOne = new User(userData[0]).save();
        let userTwo = new User(userData[1]).save();

        return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
}

module.exports = {todoData, populateTodo, userData, populateUsers}
