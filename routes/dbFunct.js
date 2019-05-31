//This .js file provides the database calls to MONGODB

var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var db;
var bcrypt = require('bcrypt');

//default users on database initialization
function defaultUsers() {
  return [{
      "email": "mriley@dentist.org",
      "password": bcrypt.hashSync('123', 10),
      "role": "HYGIENIST",
      "name": {
        "first-name": "Mary",
        "last-name": "Riley"
      },
      "enabled": true
    },
    {
      "email": "DJohn@dentist.org",
      "password": bcrypt.hashSync('123', 10),
      "role": "DOCTOR",
      "name": {
        "first-name": "Dan",
        "last-name": "Johnson"
      },
      "enabled": true
    },
    {
      "email": "admin@dentist.org",
      "password": bcrypt.hashSync('123', 10),
      "role": "ADMIN",
      "name": {
        "first-name": "Arnold",
        "last-name": "Schwarzeneggar"
      },
      "enabled": true
    },
    {
      "email": "annie@dentist.org",
      "password": bcrypt.hashSync('123', 10),
      "role": "PATIENT",
      "name": {
        "first-name": "Annie",
        "last-name": "Anderson"
      },
      "enabled": true
    }
  ];
}

// Initialize the database
mongoClient.connect("mongodb://localhost:27017/", function(err, database) {
  if (err) throw err;
  db = database.db('dentistDB');
  db.collection('users').find({}).toArray(function(err, things) {
    if (things.length < 1) {
      db.collection('users').insert(defaultUsers(), function(err, writeResult) {
        if (err) throw err;
        console.log("default users added and database initialized");
      });
    } else {
      console.log("database initialized");
    }
  });
});


//user updating and finding functions
function findById(id, cb) {
  db.collection('users').findOne({
    '_id': new mongo.ObjectID(id)
  }, function(err, user) {
    cb(err, user);
  });
}
module.exports.findById = findById;

//find by email
function findByEmail(email, cb) {
  db.collection('users').findOne({
    email: email,
  }, function(err, user) {
    cb(err, user);
  });
}
module.exports.findByEmail = findByEmail;

//get all users
function getAllUsers(cb) {
  db.collection('users').find({}).toArray(function(err, users) {
    cb(err, users);
  });
}
module.exports.getAllUsers = getAllUsers;

//get all appointments
function getAllAppointments(cb) {
  db.collection('appointments').find({}).toArray(function(err, users) {
    cb(err, users);
  });
}
module.exports.getAllAppointments = getAllAppointments;

//create user profile
function createUserProfile(userObj, cb) {
  bcrypt.hash(userObj.password, 10, function(err, hash) {
    userObj.password = hash;
    db.collection('users').insertOne(userObj, function(err, writeResult) {
      console.log(writeResult.ops[0]);
      cb(err, writeResult.ops[0]);
    });
  });
}
module.exports.createUserProfile = createUserProfile;

//update user profile
function updateUserProfile(uid, userObj, cb) {
  db.collection('users').updateOne({
    '_id': new mongo.ObjectID(uid)
  }, {
    $set: {
      enabled: userObj.enabled
    }
  }, function(err, def) {
    db.collection('users').findOne({
      '_id': new mongo.ObjectID(uid),
    }, function(err, user) {
      cb(err, user);
    });
  });
}
module.exports.updateUserProfile = updateUserProfile;

//get user appointments
function getUsersAppointments(id, cb) {
  console.log("id");
  console.log(id);
  db.collection('appointments').find({
    userid: id
  }).toArray(function(err, things) {
    console.log(things);
    cb(err, things);
  });
}
module.exports.getUsersAppointments = getUsersAppointments;

//get employee apppointments
function getEmployeeAppointments(id, cb) {
  console.log("id");
  console.log(id);
  db.collection('appointments').find({
    employeeId: id
  }).toArray(function(err, things) {
    cb(err, things);
  });
}
module.exports.getEmployeeAppointments = getEmployeeAppointments;

//create user appointment and check for conflicts in time
function createUserAppointment(userObj, cb) {
  userObj["requestDelete"] = false;
  db.collection('appointments').find({
    employeeId: userObj.employeeId,
    date: userObj.date,
    time: userObj.time
  }).toArray(function(err, things) {
    if (things == null || things.length < 1 || things == undefined) {
      db.collection('appointments').find({
        userid: userObj.userid,
        date: userObj.date,
        time: userObj.time
      }).toArray(function(err, things) {
        if (things == null || things.length < 1 || things == undefined) {
          db.collection('appointments').insertOne(userObj, function(err, writeResult) {
            console.log(writeResult.ops[0]);
            cb(err, writeResult.ops[0]);
          });
        } else {
          cb(err, {
            msg: "Appointment already Exists at that time."
          });
        }
      });
    } else {
      cb(err, {
        msg: "Appointment already Exists at that time."
      });
    }
  });
}
module.exports.createUserAppointment = createUserAppointment;

//update user appointment checks for conflicts also
function updateUserAppointment(userObj, cb) {
  db.collection('appointments').find({
    employeeId: userObj.employeeId,
    date: userObj.date,
    time: userObj.time
  }).toArray(function(err, things) {
    if (things.length < 1 || (things.length < 2 && things[0]._id == userObj._id)) {
      db.collection('appointments').find({
        userid: userObj.userid,
        date: userObj.date,
        time: userObj.time
      }).toArray(function(err, things) {
        if (things.length < 1 || (things.length < 2 && things[0]._id == userObj._id)) {
          db.collection('appointments').updateOne({
            '_id': new mongo.ObjectID(userObj._id)
          }, {
            $set: {
              time: userObj.time,
              date: userObj.date,
              type: userObj.type,
              employeeName: userObj.employeeName,
              employeeId: userObj.employeeId,
              requestedAppt: userObj.requestedAppt,
              requestedDelete: userObj.requestedDelete
            }
          }, function(err, writeResult) {
            cb(err, "successfully updated");
          });
        } else {
          console.log("UH OH ERROR THE DATABASE IS BROKEN!!");
          cb(err, {
            msg: "Appointment already Exists at that time."
          });
        }
      });
    } else {
      console.log("UH OH ERROR THE DATABASE IS BROKEN!!");
      cb(err, {
        msg: "Appointment already Exists at that time."
      });
    }
  });
}
module.exports.updateUserAppointment = updateUserAppointment;

//request delete checks for conflicts
function requestDeleteAppointment(id, cb) {
  db.collection('appointments').find({
    '_id': new mongo.ObjectID(id)
  }).toArray(function(err, things) {
    if (things.length < 1 || (things.length < 2 && things[0]._id == id)) {
      var delBool = true;
      if (things[0].requestDelete == true) {
        delBool = false;
      }
      db.collection('appointments').updateOne({
        '_id': new mongo.ObjectID(id)
      }, {
        $set: {
          requestDelete: delBool
        }
      }, function(err, writeResult) {
        cb(err, "successfully requested");
      });
    } else {
      console.log("UH OH ERROR THE DATABASE IS BROKEN!!");
      cb(err, {
        msg: "whoops, something terribly went wrong"
      });
    }
  });
}
module.exports.requestDeleteAppointment = requestDeleteAppointment;

//delete an appointment 
function deleteUserAppointment(id, cb) {
  db.collection('appointments').deleteOne({
    '_id': new mongo.ObjectID(id)
  }, function(err, writeResult) {
    cb(err, "successfully deleted");

  });

}
module.exports.deleteUserAppointment = deleteUserAppointment;
