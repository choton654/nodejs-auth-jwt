const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userScahema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [isEmail, 'Please enter a valid email'],
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Please enter a valid password'],
  },
});

// userScahema.post('save', function (doc, next) {
//   console.log('new user has created', doc);
//   next();
// });
userScahema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = new mongoose.model('user', userScahema);

module.exports = User;
