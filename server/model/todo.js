const mongoose = require('mongoose');

//Todo model
const Todo = mongoose.model('todos',{
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true //remove stupid whitespace at the top and the endof the string
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {
  Todo
}