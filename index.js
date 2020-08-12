//requiring important dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const mongoose = require('mongoose');

// require database mongoDB
const db = require('./config/mongoose');

const flash = require('connect-flash');
const session = require('express-session');

// mongo-store session
// const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');

//setting port at localhost 8000
const port = 8000;
const app = express();

//

// setting up view engines EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// bodyparser middleware
app.use(express.urlencoded({ extended: true }));

// express session middleware
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// passport require config
require('./config/passport')(passport);

// using connect flash
app.use(flash());

// global variables for flash msgs
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// connecting to the routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//calling the app on localhost 
app.listen(port, function(err){
    if(err){console.log(`Error in firing the server : ${err}`);}
    else{
        console.log(`server is up and running on port: ${port}`);
    }
})
