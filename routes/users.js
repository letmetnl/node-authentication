const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// require User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
//render login view
router.get('/login', forwardAuthenticated, (req, res) => res.render('logIn'));
// register page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// handling post request form user registration
router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    let errors = [];

    // chack all required fields
    if(!name || !email || !password || !confirmPassword){
        errors.push({msg: 'please fill all fields'});
    }
    //passwords matching
    if(password != confirmPassword){
        errors.push({ msg: 'Passwords do not match'});
    }
     // console.log(req.body)
    // res.send('hello checkin');

    // check password length to set a min length 
    if(password.length < 5){
        errors.push({ msg: 'password must be atleast 5 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        });
    }else{
        // res.send('pass');
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // user exist
                    errors.push({ msg: 'Email is already registered'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        confirmPassword
                    });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // User.create({
                    //     name: req.body.name,
                    //     email: req.body.email,
                    //     password: req.body.password
                    // }, function(err, newUser){
                    //     if(err){console.log('error in creating a user');
                    // return;}
                    // console.log('****', newUser);
                    // return res.redirect('back');
                    // });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        //set password to hashed
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user =>{
                                // res.flash('success_msg', 'Registered Successfully! You can login now');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        });
                    });
                    
                }
            });

    }

});

// handling post request to login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// handling logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'u are logged out');
    res.redirect('/users/login');
});

//export this route
module.exports = router;