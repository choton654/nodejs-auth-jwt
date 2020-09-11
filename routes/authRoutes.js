const { Router } = require('express');

const router = Router();

const {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
} = require('../controller/authController');

router.get('/signUp', signup_get);
router.get('/login', login_get);
router.post('/signUp', signup_post);
router.post('/login', login_post);
router.get('/logout', logout_get);

module.exports = router;
