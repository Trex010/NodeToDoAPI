const mongoose = require('mongoose');

const validator = require('validator');

//User model
const User = mongoose.model('User',{
  email:{
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim:true,
  }
})

module.exports = {
  User
}
