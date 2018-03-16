const request = require('supertest');

const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app } = require('./../server');
const {Todo} = require('./../model/todo');

const todoData = [{
  _id: new ObjectID(),
  text:'First thing'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}]

beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todoData);
    })
    .then(() => done())
});

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

  it('should return 404 if id is not founds', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .get(`get/todos/${hexId}`)
      .expect(404)
      .end(done)

  });

  it('should return 404 if id is not valid object ', (done) => {
    request(app)
      .get('get/todos/5aab7d71c505930d44dac8aa')
      .expect(404)
      .end(done)

  })
});

describe('delete /todos/:id', () => {
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
