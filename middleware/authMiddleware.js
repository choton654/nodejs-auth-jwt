const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const authMiddleware = (req, res, next) => {
  console.log(req.headers.cookie);
  const token = req.headers.cookie?.split('=')[1];
  console.log(token);
  if (token) {
    jwt.verify(token, 'new secret', (err, decoded) => {
      if (!err) {
        console.log(decoded);
        next();
      } else {
        console.log(err.message);
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/login');
  }
};

const checkUser = (req, res, next) => {
  const token = req.headers.cookie?.split('=')[1];
  if (token) {
    jwt.verify(token, 'new secret', async (err, decoded) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decoded.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { authMiddleware, checkUser };
