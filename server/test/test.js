const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const _ = require('lodash')

const {app } = require('./../server');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');

const {todoData, populateTodo, userData, populateUsers}= require('./seed/seed.js');

beforeEach(populateTodo);
beforeEach(populateUsers);

describe('POST /todos ', () => {
  it('should create a new todo', (done)=> {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth',userData[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });


  });

  it('should not create a new todo with invalid body', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth',userData[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  })
});

describe('GET /todos ', ()  => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth',userData[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo document', (done) => {
    request(app)
      .get(`/todos/${todoData[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todoData[0].text);
      })
      .end(done)
  });

  // it('should return 404 if id is not founds', (done) => {
  //   let hexId = new ObjectID().toHexString();
  //   request(app)
  //     .get(`todos/${hexId}`)
  //     .expect(404)
  //     .end(done)
  //
  // });
  //
  // it('should return 404 if id is not valid object ', (done) => {
  //   request(app)
  //     .get('todos/5aab7d71c505930d44dac8aa')
  //     .expect(404)
  //     .end(done)
  //
  // })
});

describe('DELETE /todos/:id', () => {
  it('should delete and return todo document', (done) => {
    request(app)
      .delete(`/todos/${todoData[1]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todoData[1].text);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(todoData[1]._id.toHexString())
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if id is not founds', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  });

  it('should return 404 if id is not valid object ', (done) => {
    request(app)
      .delete('/todos/5aab7d71cdac8aa')
      .expect(404)
      .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  let newObject =  {
    text: 'thien',
    completed: true
  }

  it('should update and return todo document', (done) => {
    request(app)
      .patch(`/todos/${todoData[1]._id.toHexString()}`)
      .send(newObject)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newObject.text);
        expect(res.body.todo.completed).toBe(newObject.completed);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should update and return todo document', (done) => {
    request(app)
      .patch(`/todos/${todoData[1]._id.toHexString()}`)
      .send({completed:false, text: 'thien'})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newObject.text)
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completeAt).toNotExist();
      })
      .end(done);
  });


  it('should return 404 if id is not founds', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .send(newObject)
      .expect(404)
      .end(done)
  });

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done)=> {
    request(app)
      .get('/users/me')
      .set('x-auth', userData[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(userData[0]._id.toHexString());
        expect(res.body.email).toBe(userData[0].email);
      })
      .end(done)
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  });

});

describe('POST /user', () => {
  let newData = _.pick(userData[2], ['email', 'password'])
  it('should create a new user', (done)=> {

    request(app)
      .post('/users')
      .send(newData)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(newData.email);
      })
      .end((err, res) => {
        User.findOne({email: newData.email})
          .then(user => {
            expect(user).toExist()
            expect(user.password).toNotEqual(newData.password);
            done()
          })
          .catch(e => done(e));
      });
  });
  it('should return validation error if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'thien', password: '123'})
      .expect(400)
      .end(done);
  })

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: userData[0].email, password: userData[0].password})
      .expect(400)
      .end(done);
  });
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: userData[0].email,
        password: userData[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        User.findById(userData[0]._id)
          .then(user => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: userData[0].email,
        password: '123'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        User.findById(userData[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });

});

describe('DELETE /users/token/me', () => {
  it('should remove token auth token ', (done) => {
    request(app)
      .delete('/user/me/token')
      .set('x-auth', userData[0].tokens[0].token)
      .expect(200)
      .end((err,res) => {
        if(err){
          done(err);
        }

        User.findById(userData[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });

  });
});
