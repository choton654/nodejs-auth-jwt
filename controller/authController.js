const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleError = (err) => {
  console.log(err.message, err.code);

  let error = {};

  if (err.code === 11000) {
    return (error.email = 'the email or password already exists');
  }

  if (err.message.includes('user validation failed:')) {
    Object.values(err.errors).forEach(({ properties: { path, message } }) => {
      error[path] = message;
    });
  }
  return error;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id: id }, 'new secret', { expiresIn: maxAge });
};

module.exports = {
  signup_get: (req, res) => {
    res.render('signUp');
  },
  login_get: (req, res) => {
    res.render('login');
  },
  login_post: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
        return res.status(201).json({ user: user._id });
      } else {
        return res
          .status(400)
          .json({ error: { password: 'password dont match' } });
      }
    } else {
      return res.status(400).json({ error: { email: 'email dont match' } });
    }
  },
  signup_post: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
      res.status(201).json({ user: user._id });
    } catch (err) {
      const error = handleError(err);
      res.status(400).json({ error });
    }
  },
  logout_get: (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  },
};
