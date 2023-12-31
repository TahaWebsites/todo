const express = require('express');
const mongoose = require('mongoose');
const User = require('./src/models/register');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

mongoose.connect('mongodb+srv://admin:tahaistheboss@dev.zb2ylxs.mongodb.net/UserDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to database')
  }).catch((err) => {
    {
      console.log('errorrrrrrrrr')
    }
  })

app.use(session({
  secret: 'hola bhola', // Change this to a strong, random key
  resave: false,
  saveUninitialized: false // Set secure to true if using HTTPS
}));


app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});


passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (foundUser.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, foundUser);
  } catch (err) {
    return done(err);
  }
}));


app.get('/', (req, res) => {
  res.render('login')
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

app.get('/test', isAuthenticated, (req, res) => {
  res.render('test')
})

app.post('/test', (req, res) => {

})

app.post('/signup', (req, res) => {
  const data = new user({
    username: req.body.username,
    password: req.body.password
  })
  const registered = data.save();
  console.log('Data Added')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/test',
  failureRedirect: '/',
  failureFlash: true,
}));

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout', error: err });
    }
    res.redirect('/');
  });
})

// app.post('/login', async (req, res) => {

//   const password = req.body.password;

//   try {
//     const check = await register.findOne({ username: req.body.username });

//     if (check) {

//       if (password === check.password) {
//         res.render('home', { person: req.body.username });
//       } else {
//         res.send('Incorrect password');
//       }
//     } else {
//       res.send('User does not exist');
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.listen(1254, () => {
  console.log('hosted on http://localhost:1254/')
})