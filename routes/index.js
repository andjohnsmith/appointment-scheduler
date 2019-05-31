//This javascript file provides endpoints for the Dental Web App
var express = require('express');
var router = express.Router();
var dbFunct = require('./dbFunct');
//ROUTES

//get home page
router.get('/app', function(req, res, next) {
  res.sendFile('index.html', {
    root: __dirname + "/../public"
  });
});

//check admin permissions
function checkAdminPerms(req, res, cb) {
  dbFunct.findById(req.session.user._id, function(err, user) {
    if (((user && (req.session.user._id == user._id)) && (req.session.csrf == req.headers.csrf)) &&
      (user.enabled && user.role === "ADMIN")) {
      res.set({
        'csrf': req.session.csrf
      });
      cb(req, res);
      return;
    }
    res.status(400).send({
      msg: "User Not Authenticated or permissions denied, logging out"
    });
  });
}

//check user permissions
function checkUserPerms(req, res, cb) {
  dbFunct.findById(req.session.user._id, function(err, user) {
    if (((user && (req.session.user._id == user._id)) && (req.session.csrf == req.headers.csrf)) &&
      (user.enabled && user.role !== "ADMIN")) {
      res.set({
        'csrf': req.session.csrf
      });
      cb(req, res);
      return;
    }
    res.status(400).send({
      msg: "User Not Authenticated or permissions denied, logging out"
    });
  });
}

//admin ROUTES

//get all users
router.get('/app/api/v1/admin/users', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    dbFunct.getAllUsers(function(err, things) {
      if (things == null || err) {
        res.status(400).send({
          msg: "Database failure in finding Users."
        });
        return;
      } else {
        things.forEach(x => delete x.password);
        res.send(things);
        return;
      }
    });
  });
});

//admin get all components
router.get('/app/api/v1/admin/appointments', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    dbFunct.getAllAppointments(function(err, things) {
      if (things == null || err) {
        res.status(400).send({
          msg: "Database failure in finding Users."
        });
        return;
      } else {
        res.send(things);
      }
    });
  });
});


//post a new appointment
router.post('/app/api/v1/admin/appointment', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    var newAppointment = JSON.parse(req.body.userSend);
    newAppointment["requestedAppt"] = false;
    newAppointment["requestDelete"] = false;
    console.log("NEW APPOINTMENT");
    console.log(newAppointment);

    dbFunct.createUserAppointment(newAppointment, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in updating user."
        });
        return;
      } else {
        res.send(thing);
        return;
      }
    });
  });
});

//request an appointment from a user prespective
router.post('/app/api/v1/users/appointment', function(req, res, next) {
  checkUserPerms(req, res, function(req, res) {
    var newAppointment = JSON.parse(req.body.userSend);

    console.log("NEW APPOINTMENT");
    console.log(newAppointment);

    dbFunct.createUserAppointment(newAppointment, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in updating user."
        });
        return;
      } else {
        res.send(thing);
        return;
      }
    });
  });
});


//update an appointment
router.put('/app/api/v1/admin/appointment', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    var newAppointment = JSON.parse(req.body.userSend);
    newAppointment["requestedAppt"] = false;
    console.log("Updated Appointment")
    console.log(newAppointment);

    dbFunct.updateUserAppointment(newAppointment, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in updating user."
        });
        return;
      } else {
        res.send(thing);
        return;
      }
    });
  });
});

//REQUEST TO DELETE AN APPOINTMENT
router.put('/app/api/v1/users/appointment', function(req, res, next) {
  checkUserPerms(req, res, function(req, res) {
    var id = JSON.parse(req.body.userSend)._id;
    console.log("Updated Appointment")
    console.log(id);

    dbFunct.requestDeleteAppointment(id, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in updating user."
        });
        return;
      } else {
        res.send(thing);
        return;
      }
    });
  });
});

//delete an appointment
router.delete('/app/api/v1/admin/appointment', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    var deleteAppointment = JSON.parse(req.body.userSend);
    console.log("deleted Appointment");

    dbFunct.deleteUserAppointment(deleteAppointment._id, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in deleting Appointment."
        });
        return;
      } else {
        res.send(thing);
        return;
      }
    });
  });
});

//update user profile
router.put('/app/api/v1/admin/user', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    var updatedUser = JSON.parse(req.body.userSend);
    console.log(req.session.user._id);
    if (req.session.user._id === updatedUser._id) {
      res.status(400).send({
        msg: "Cannot disable yourself!"
      });
      return;
    }
    console.log(updatedUser);
    dbFunct.updateUserProfile(updatedUser._id, updatedUser, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in updating user."
        });
        return;
      } else {
        delete thing.password;
        res.send(thing);
        return;
      }
    });
  });
});

//create a user
router.post('/app/api/v1/admin/user', function(req, res, next) {
  checkAdminPerms(req, res, function(req, res) {
    var updatedUser = JSON.parse(req.body.userSend);
    dbFunct.findByEmail(updatedUser.email, function(err, usr){
      console.log(usr);
      if(usr){
        res.status(400).send({
          msg: "User with that email already exists!!!"
        });
        return;
      }
    dbFunct.createUserProfile(updatedUser, function(err, thing) {
      if (thing == null || err) {
        res.status(400).send({
          msg: "Database failure in creating user."
        });
        return;
      } else {
        delete thing.password;
        res.send(thing);
        return;
      }
    });

  });
  });
});

//User ROUTES

//get a single users appointments
router.get('/app/api/v1/users/:userid/appointments', function(req, res, next) {
  checkUserPerms(req, res, function(req, res) {
    dbFunct.getUsersAppointments(req.params.userid, function(err, things) {
      if (things == null || err) {
        res.status(400).send({
          msg: "Database failure in finding Users."
        });
        return;
      } else {
        res.send(things);
      }
    });
  });
});

//get employees appointments
router.get('/app/api/v1/users/:userid/employeeAppointments', function(req, res, next) {
  checkUserPerms(req, res, function(req, res) {
    dbFunct.getEmployeeAppointments(req.params.userid, function(err, things) {
      if (things == null || err) {
        res.status(400).send({
          msg: "Database failure in finding Users."
        });
        return;
      } else {
        res.send(things);
      }
    });
  });
});



module.exports = router;
