const request = require('supertest');

const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app } = require('./../server');
const {Todo} = require('./../model/todo');

const {todoData, populateTodo, userData, populateUsers}= require('./seed/seed.js');

beforeEach(populateTodo);
beforeEach(populateUsers);

describe('POST /todos ', () => {
  it('should create a new todo', (done)=> {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
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
