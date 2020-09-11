const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { authMiddleware, checkUser } = require('./middleware/authMiddleware');
const coockieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const PORT = 5000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(coockieParser());
const keys = require('./config/keys');

//db connection
const dbUri = keys.mongoUri;
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('server is running')))
  .catch((err) => console.log(err));

//routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/smoothies', authMiddleware, (req, res) => {
  res.render('smoothies');
});

//cookies
// app.get('/setcookie', (req, res) => {
//   // res.setHeader('set-Cookie', 'newUser=true');
//   res.cookie('newUser', true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   });
//   res.send('cookie has set');
// });

// app.get('/read-cookie', (req, res) => {
//   const cookie = req.cookies;
//   console.log(cookie.newUser);
// });
app.use(authRoutes);
