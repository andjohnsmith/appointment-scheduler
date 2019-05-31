//this javascript file provides authentication endpoints

var express = require('express');
var router = express.Router();
var dbFunct = require('./dbFunct.js');
var uuidv1 = require('uuid/v1');
var bcrypt = require('bcrypt');

//check user email by wikipedia standards
function checkEmail(email) {
  var regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email.match(regex) !== null) {
    return 1;
  } else {
    return null;
  }
}

//logout endpoint
router.post('/app/api/v1/logout', function(req, res, next) {
  var msgtext = "Logout Error";
  if (req.session) {
    msgtext = 'Logout successful.';
  }
  req.session.regenerate(function(err) {
    res.send({
      msg: msgtext
    });
  });
});

//login endpoint used to check if user was previously logged in as well
router.post('/app/api/v1/login', function(req, res, next) {
  if (req.session && req.session.user != null) {
    dbFunct.findById(req.session.user._id, function(err, user) {
      if (user && req.session.user._id == user._id) {
        req.session.user = user;
        delete user.password;
        res.send(user);
      } else {
        res.status(403).send({
          msg: "Error in database call."
        });
      }
    });
  } else if (req.body.username == "" || req.body.username == "") {
    res.status(403).send({
      msg: "Not authenticated or input error."
    });
  } else {
    var requsername = req.body.username;
    var reqpassword = req.body.password;
    if ((requsername != null) && (checkEmail(requsername) == null)) {
      res.status(403).send({
        msg: "Invalid Email."
      });
    }
    req.session.regenerate(function(err) {
      dbFunct.findByEmail(requsername, function(err, user) {
        if (user && (user.enabled && (user.email == requsername))) {
          bcrypt.compare(reqpassword, user.password, function(err, success) {
            if (success) {
              req.session.user = user;
              delete user.password;
              res.send(user);
            } else {
              res.status(403).send({
                msg: "Error logging in."
              });
            }
          });
        } else if (user && user.enabled == false) {
          res.status(403).send({
            msg: "User DISABLED!"
          });
        } else {
          res.status(403).send({
            msg: "Error logging in."
          });
        }
      });
    });
  }
});

module.exports = router;
