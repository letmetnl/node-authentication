const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// home page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
    if(err){
        console.log('Error', err);
    }else{
        res.render('dashboard', {
            name: req.user.name
        });
    }
})
    

//export this route
module.exports = router;