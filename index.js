const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const { Task, User } = require('./database/db');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'hola bhola', // Change this to a strong, random key
    resave: false,
    saveUninitialized: false // Set secure to true if using HTTPS
}));
app.use(flash());

mongoose.connect('mongodb+srv://admin:tahaistheboss@dev.zb2ylxs.mongodb.net/tododb?retryWrites=true&w=majority')
    .then(() => {
        console.log(`Connected to MongoDB Atlas`);
    })
    .catch((error) => {
        console.error(`MongoDB connection error: ${error}`);
    });

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

passport.use(new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    try {
        const foundUser = await User.findOne({ username: username });

        if (!foundUser) {
            return done(null, false, req.flash('error', "User Doesn't Exist"));
        }

        if (foundUser.password !== password) {
            return done(null, false, req.flash('error', 'Incorrect Password'));
        }

        return done(null, foundUser);

    } catch (err) {
        return done(err);
    }
}));




app.get('/', (req, res) => {
    res.render('login', { message: req.flash('error') || '' });
});

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    try {
        const searchUser = await User.findOne({ username: req.body.username });

        if (!searchUser) {
            const { name, username, password } = req.body;

            const newUser = new User({
                name,
                username,
                password
            });

            await newUser.save();
            console.log('Data Added');
            res.redirect('/home');
        } else {
            res.send('User Already Exists');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/login',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/'        
    }),
    (req, res) => {
        // Successful authentication, redirect to some page
        res.redirect('/home');
    }
);


app.get('/home', isAuthenticated, (req, res) => {
    res.render('todo', { userDetails: req.user, url: '/delete/', message: req.flash('msg') || '', name: req.user.name });
    // {userDetails : req.user}
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error during logout', error: err });
        }
        res.redirect('/');
    });
})

app.post('/home', isAuthenticated, async (req, res) => {
    const newUserTask = new Task({ taskTitle: req.body.task });
    if (newUserTask.taskTitle.length == 0) {
        req.flash('msg', 'Enter Valid Task');
        res.redirect('/home');
    }
    else {
        // req.flash('msg', 'Task Added');
        await newUserTask.save();

        req.user.tasks.push(newUserTask);
        await req.user.save()
        .then(() => {
            // console.log(`task added`);
            res.redirect('/home')}
        ) 
        .catch((err) => console.log(err));
    }
});

app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Delete the task from the Task collection
        await Task.deleteOne({ _id: id });
        // console.log(`Task deleted with ID: ${id}`);

        // Remove the task from the user's tasks array
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { tasks: { _id: id } } }
        );

        console.log(`Task with ID ${id} deleted successfully`);
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

app.listen(1254, () => {
    console.log('Server live at http://localhost:1254/');
})