const mongoose = require('mongoose');

//User model
const User = mongoose.model('User',{
  email:{
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim:true
  }
})

module.exports = {
  User
}
