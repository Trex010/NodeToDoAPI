const {mongoose} = require('./server/db/mongoose.js');
const {ObjectID} = require('mongodb');

const {Todo} = require('./server/model/todo.js');
let id = '5aa6692736b0042245a2f65';

// Todo.find({ _id: id })
//   .then((todos) =>{
//     console.log('Todos', todos);
//   });
//
// Todo.findOne({ _id: id })
//   .then((todo) => {
//     console.log('Todo', todo);
//   })

if(!ObjectID.isValid(id)){
  console.log('ID not valid');
} else {
  Todo.findById(id)
    .then((todo) => {
      if(!todo){
        return console.log('ID not found');
      }
        console.log('Todo', todo);
    })
    .catch((err) => {
      console.log(err);
    });
}
