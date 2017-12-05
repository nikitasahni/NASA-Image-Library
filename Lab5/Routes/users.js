const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: 'nsahni2',
    api_key: 'webtech3316'
  }
};

var client = nodemailer.createTransport(sgTransport(options));

// Register
router.post('/register', (req, res, next) => {
  
  User.getUserByEmail(req.body.email, (err, user) => {
    if(err) throw err;
    if(user){
      return res.json({success: false, msg: 'Email has already been used for registration.'});
    }
    
    //Create user to add to db
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      active: req.body.active
    });

    //Add user to db
    User.addUser(newUser, (err, user) => {
      if(err){
        res.json({success: false, msg:'Failed to register user'});
      } 
      if(user) {
        var url = 'https://lab5-nsahni.c9users.io:8080/users/activate/' + user._id;
        var email = {
        from: 'NASA Images, nasaimageslibrary@gmail.com',
        to: user.email,
        subject: 'Confirm your account with NASA Images',
        text: 'Hello ' + user.name + ', thank you for registering at NASA Images Library. Please click on the following link to complete your activation: ' + url,
				html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at NASA Images Library. Please click on the link below to complete your activation:<br><br><a href=' + url + '>' + url + '</a>'
        };
      
        client.sendMail(email, function(err, info){
          if (err){
            console.log(err);
          }
          else {
            console.log(info);
          }
        });
        res.json({success: true, msg:'User registered'});
      }
    });
  });
});

//Activate
router.get('/activate/:user_id', (req, res) => {
  User.findOne({'_id': req.params.user_id}, (err, user) =>{
    if(err) return res.json({success: false, msg: err});
    if(user){
      user.active = true;
      user.save(function(err){
          if(err){
              res.send(err);
          } 
          res.json({message:'User verified!'});
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data:user}, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            active: user.active
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

// Get all users for testing
router.get('/all', (req, res) => {
    User.find((err, users) => {
        if(err){
            res.send(err);
        }
        res.json(users);
    });
});

//User deletion for testing
router.delete('/del/:user_id', (req, res) => {
   User.remove({
       _id:req.params.user_id
   }, function(err, user){
       if(err){
           res.send(err);
       }
       res.json({message: 'User deleted'});
   });
});

module.exports = router;

