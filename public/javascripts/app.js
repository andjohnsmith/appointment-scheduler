//JAVASCRIPT FRONT END FOR FAMM WEB APP CS 341


//global vars
var currentUser;
var currentAppointments = null;
var updateAppointmentObj = null;
var userList = null;


//pages global val
var state = {
  page: {
    pages: [
      "login", "user-home", "admin-home", "appointments", "create-appointment",
      "update-appointment", "create-user", "users-list", "request-appointment"
    ],
    page: null
  }
}

//opens user manual in new window
function openmanual(){
window.open("/manuals/usermanual.pdf")
}

//initializes functions to be able to fill calendar if user logs in
window.onload = function() {
  initCalendar();
}

//if page is refreshed it will load logged in user
$(document).ready(function() {
  $('select').attr("class", "browser-default");
  setPage('login');
  $("#login").hide();
  $("#login").fadeIn(800);
  $.ajax({
    url: 'app/api/v1/login',
    type: 'POST',
    data: {
      username: "",
      password: ""
    },
    error: unsuccessfulLogin,
    success: function(res, textStatus, xhr) {
      if (res.hasOwnProperty('msg')) {
        if (thing.msg !== "Not authenticated or input error.") {
          alert(thing.msg);
        }
        return;
      }
      userid = res._id;
      successfulLogin(res);
    },
  });
  name = "";
  pass = "";
});

//CALENDAR FUNCTIONS
var date = new Date();
var currentYear = date.getFullYear();
var currentMonth = date.getMonth() + 1;
var currentDay = date.getDate();
var currentWeekday = date.getDay();

var months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getWeekdayStartMonth(year, month) {
  return new Date(year + "-" + month + "-01").getDay();
}

function initCalendar() {
  $(".monthName").empty();
  $(".monthName").append(months[currentMonth - 1]);
  var weekdayStartOfMonth = getWeekdayStartMonth(currentYear, currentMonth);

  var numOfDays = daysInMonth(currentYear, currentMonth);
  fillCurrentUserDays(currentAppointments);
}

function nextMonth() {
  //case for the end of the year
  if (currentMonth == 12) {
    currentMonth = 1;
    currentYear++;
  } else {
    currentMonth++;
    currentDay = 1;
  }
  $(".monthName").empty();
  $(".monthName").append(months[currentMonth - 1]);
  $('.calYear').empty();
  $('.calYear').append(currentYear);
  var weekdayStartOfMonth = getWeekdayStartMonth(currentYear, currentMonth);
  var numOfDays = daysInMonth(currentYear, currentMonth);
  fillCurrentUserDays(currentAppointments);
}

function prevMonth() {
  if (currentMonth == 1) {
    currentMonth = 12;
    currentYear--;
  } else {
    currentMonth--;
    currentDay = 1;
  }

  $(".monthName").empty();
  $(".monthName").append(months[currentMonth - 1]);
  $('.calYear').empty();
  $('.calYear').append(currentYear);
  fillCurrentUserDays(currentAppointments);
}

//fix stupid input string garbage
function processTime(time) {
  var timeSplit = time.split(":");
  if (time.indexOf("0") == 0) {
    return (time.slice(1, 5) + " AM")
  } else if (parseInt(timeSplit[0]) > 12) {
    return (Math.floor((timeSplit[0]) - 12) + ":" + timeSplit[1] + " PM")
  } else if (parseInt(timeSplit[0]) == 12) {
    return (time + " PM")
  } else if (parseInt(timeSplit[0]) < 12 || parseInt(timeSplit[0]) > 9) {
    return (time + " AM")
  }
  return "Corrupt Time Format";
}

//fills calendar with the appointment view
function createAppointmentView(appointmentData) {
  $("#appts").empty();
  for (var i = 0; i < appointmentData.length; i++) {

    var employeeName = appointmentData[i]['employeeName']['first-name'] + " " + appointmentData[i]['employeeName']['last-name'];
    var patientName = appointmentData[i]['name']['first-name'] + " " + appointmentData[i]['name']['last-name'];
    var time = processTime(appointmentData[i]['time']);
    var appt = $('<div class="appt"></div');
    var num = $('<div> Appointment: ' + (i + 1) + '</div>');
    appt.append(num);
    var dr = $('<div> Doctor: ' + employeeName + '</div>');
    appt.append(dr);
    var ptnt = $('<div> Patient: ' + patientName + '</div>');
    appt.append(ptnt);
    var time = $('<div> Time: ' + time + '</div>');
    appt.append(time);
    var type = $('<div> Type: ' + appointmentData[i]["type"] + '</div>');
    appt.append(type);

    var reqDel = "No";
    var reqApp = "No"
    if (appointmentData[i]["requestDelete"]) {
      reqDel = "Requested";
    }
    if (appointmentData[i]["requestedAppt"]) {
      reqApp = "Requested";
    }


    var reqDel = $('<div> Requested To Delete: ' + reqDel + '</div>');
    appt.append(reqDel);
    var reqApp = $('<div> Requested Appointment: ' + reqApp + '</div>');
    appt.append(reqApp);
    $('#appts').append(appt);
  }
}

//shows a single appointment
function showSingleAppointment(day, month, year, appointmentData) {
  if (appointmentData != null) {
    createAppointmentView(appointmentData);
  }
  $('#date').empty();
  $('#date').append(months[month - 1] + " " + day);
  $('#appointments').slideDown();
  $('#user-home').slideUp();
}

//close the appointment view
function closeAppointmentView() {
  $('#appointments').slideUp();
  $('#user-home').slideDown();
}

//fills the current user days
function fillCurrentUserDays(appointments) {
  $(".days").empty();
  var numOfDays = daysInMonth(currentYear, currentMonth);
  var weekdayStartOfMonth = getWeekdayStartMonth(currentYear, currentMonth);
  for (var i = 1; i <= numOfDays + weekdayStartOfMonth; i++) {
    var appointmentData = new Array();

    if (i <= weekdayStartOfMonth) {
      $('.days').append('<li></li>');
    } else {
      //PROCESS APPPOINTMENT BEFORE ADDING TO CALENDAR
      if (appointments != null && appointments.length > 0) {
        for (var j = 0; j < appointments.length; j++) {
          var dateSplit = appointments[j].date.split("-");
          var apptYear = dateSplit[0];
          var apptMonth = dateSplit[1];
          var apptDay = dateSplit[2];
          if (((parseInt(apptYear) == currentYear) && (parseInt(apptMonth) == currentMonth)) &&
            (parseInt(apptDay) == (i - weekdayStartOfMonth))) {
            appointmentData.push(appointments[j]);
          }
        }
      }

      //if it is an appointment make it clickable
      if (appointmentData.length > 0) {
        var style = "clickable"
        if (appointmentData[0].requestedAppt || appointmentData[0].requestDelete) {
          style = "redclickable";
        }
        var li = $('<li><span class=' + style + '>' + (i - weekdayStartOfMonth) + '</span></li>');

        //create copy to fix stupid pass by reference
        var copy = thingToValue(appointmentData);
        li.click((event) => showSingleAppointment(i - weekdayStartOfMonth, currentMonth, currentYear, copy));
        $('.days').append(li);
      } else {
        var li = $('<li><span>' + (i - weekdayStartOfMonth) + '</span></li>');
        $('.days').append(li);
      }
    }
  }
}

//DEEP CLONE FIX FOUND ON STACKOVERFLOW.COM
function thingToValue(obj) {
  var holder = JSON.stringify(obj);
  var copy = JSON.parse(holder);
  return copy;
}
//END CALENDAR functions


//this function retrieves appointments
function retrieveAppointments() {
  var endpoint = "appointments";
  if (currentUser.role === "DOCTOR" || (currentUser.role === "HYGIENIST")) {
    endpoint = "employeeAppointments";
  }

  $.ajax({
    url: 'app/api/v1/users/' + currentUser["_id"] + '/' + endpoint,
    type: 'GET',
    error: function() {
      alert("error getting appointments")
    },
    success: function(res, textStatus, xhr) {
      if (res.hasOwnProperty('msg')) {
        alert(thing.msg);
        return;
      }
      currentAppointments = res;
      fillCurrentUserDays(res);
      initializeUserAppList();
    },
  });
}

//this function retrieves all appointments
function retrieveAllAppointments() {
  $.ajax({
    url: '/app/api/v1/admin/appointments',
    type: 'GET',
    error: function() {
      alert("error getting appointments")
    },
    success: function(res, textStatus, xhr) {
      if (res.hasOwnProperty('msg')) {
        alert(thing.msg);
        return;
      }
      currentAppointments = res;
      fillAdminTable(res);
    },
  });
}

//this function checks the email to prevent scripts being sent through the login
function checkEmail(email) {
  var regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email.match(regex) !== null) {
    return 1;
  } else {
    return null;
  }
}

//logins to the server login endpoint
function login(event) {
  event.preventDefault();
  var name = document.getElementById('usernameInput').value;
  var pass = document.getElementById('passwordInput').value;
  if (name !== "") {
    if (checkEmail(name) == null) {
      alert("invalid email");
      return;
    }
  }
  $.ajax({
    url: 'app/api/v1/login',
    type: 'POST',
    data: {
      username: name,
      password: pass
    },
    error: unsuccessfulLogin,
    success: function(res, textStatus, xhr) {
      if (res.hasOwnProperty('msg')) {
        alert(thing.msg);
        return;
      }
      userid = res._id;
      successfulLogin(res);
    },
  });
  name = "";
  pass = "";
}




//LOGIN AND LOGOUT FUNCTIONS
function successfulLogin(res) {
  event.preventDefault();
  var name = document.getElementById('usernameInput');
  var pass = document.getElementById('passwordInput');
  currentUser = res;

  if (currentUser.role == "ADMIN") {
    setPage('admin-home');
    retrieveAllAppointments();
    getAllUsers();
  } else {
    $("#greeting").html("Greetings " + currentUser.name["first-name"] + " "
    + currentUser.name["last-name"]);
    setPage('user-home');
    retrieveAppointments();
  }

  name.value = "";
  pass.value = "";
}

//Login Error message
function unsuccessfulLogin(res) {
  if (res.responseJSON.hasOwnProperty('msg')) {
    if (res.responseJSON.msg !== "Not authenticated or input error.") {
      alert(res.responseJSON.msg);
    }
    return;
  }
}


//regenerates session
function serverlogout() {
  $.ajax({
    url: 'app/api/v1/logout',
    method: 'POST',
    success: function(res) {
      setPage('login');
    },
  });
}

//This function is for logging out
function logout() {
  serverlogout();
  currentUser = null;
  userList = null;
  currentAppointments = null;
  updateAppointmentObj = null;
  userList = null;
}

//gets all users for selectors, password is deleted so it is client safe
function getAllUsers() {
  $.ajax({
    url: '/app/api/v1/admin/users',
    type: 'GET',
    error: function() {
      alert("error getting users")
    },
    success: function(res, textStatus, xhr) {
      if (res.hasOwnProperty('msg')) {
        alert(thing.msg);
        return;
      }
      userList = res;
    }
  });
}

//retrieves all users
function retrieveUsers() {
  $.ajax({
    url: '/app/api/v1/admin/users',
    method: 'GET',
    success: updateUsersList
  })
}

//updates the user list table that the admin views
function updateUsersList(users) {
  var table = $('#user-table').empty();
  var header = $('<tr><th>Name</th><th>Email</th><th>Role</th><th>Enabled</th></tr>');
  header.appendTo(table);
  users.forEach(u => {
    var row = $('<tr><td>' + u.name["first-name"] + " " + u.name["last-name"] + '</td><td>'
    + u.email + '</td><td>' + u.role + '</td><td>' + u.enabled + '</td></tr>');
    row.click(function() {
      deleteUser(u);
    });
    row.appendTo(table);
  });
}

//this function sets the page based on the html button pressed
function setPage(page) {
  state.page.page = page;

  if (page === "admin-home") {
    retrieveAllAppointments();
  } else if (page === "create-appointment") {
    $("#appt-time").val("");
    $("#appt-date").val("");
    $("#appt-type").val("");
    $("#employeeName").val("");
    $('#patientName').val("");
    fillSelectors();
  } else if (page === "users-list") {
    retrieveUsers();
  } else if (page === "user-home") {
    $("#requestAppointment").remove();
    if (currentUser.role === "PATIENT") {
      $("#toolbar").append('<span id="requestAppointment" onclick="setPage(' + "'request-appointment'" + ')" class="waves-effect waves-light btn">Request Appointment</span>');
    }
  }

  state.page.pages.forEach(
    p => {
      var selector = "#" + p;
      state.page.page === p ? $(selector).fadeIn() : $(selector).hide();
    }
  );
}

//function to fill selectors with patients so far....
function fillSelectors() {
  var select = $('#patientName').empty();
  var patients = userList.filter(user => {
    var searchTextbool = false;
    if (user["role"] == "PATIENT") {
      searchTextbool = true;
    }
    return searchTextbool;
  });

  patients.forEach(patient => {
    var option = $('<option value=' + patient["_id"] + '>' + patient.name["first-name"] +
      ' ' + patient.name["last-name"] + '</option>');
    option.appendTo(select);
  })
}

//fill employees selector based on type so far...
function getEmployeesForType(typeSelector, nameSelector) {

  //this function converts the type of appointment for the employee selector
  function typeOfApp(appointment) {
    switch (appointment) {
      case "Cleaning":
        return "HYGIENIST";
      case "Tooth Extraction":
        return "DOCTOR";
      case "Tooth Implant":
        return "DOCTOR";
      case "Root Canal":
        return "DOCTOR";
    }
  }


  var select = $(nameSelector).empty();
  var employeeType = typeOfApp($(typeSelector).val());
  var employees = userList.filter(user => {
    var searchTextbool = false;
    if (user["role"] == employeeType) {
      searchTextbool = true;
    }
    return searchTextbool;
  });

  employees.forEach(patient => {
    var option = $('<option value=' + patient["_id"] + '>' + patient.name["first-name"] +
      ' ' + patient.name["last-name"] + '</option>');
    option.appendTo(select);
  })
}


//ADMIN TABLE FUNCTIONS
function fillAdminTable(things) {
  if (things == null) {
    return;
  }
  var table = $('#admintable').empty();
  var props = ['Name', 'Employee', 'Date', 'Time', 'Type', 'Requested to Cancel?', "Requested Appointment"];
  // make header
  makeRow('th', props).appendTo(table);
  //add css styling classes
  //create game objects and add them to the table
  createTable(things, table);
}

//fill the table with appointments
function createTable(things, table) {
  things.forEach(thing => {
    var thingsList = thingsForTable(thing);

    var deleteStyle = "nonRequested"
    var requestStyle = "nonRequested"
    if (thingsList[5] == "YES") {
      deleteStyle = "requested";
    }
    if (thingsList[6] == "YES") {
      requestStyle = "requestedAppt";
    }

    thingsList[3] = processTime(thingsList[3]);
    var tr = makeRow('td', thingsList);
    tr.find("td:nth-of-type(6)").attr('id', deleteStyle);
    tr.find("td:nth-of-type(7)").attr('id', requestStyle);
    tr.click((event) => showAdminAppointment(thing));
    tr.appendTo(table);
    thing.row = tr;
  });
}

//catalog data for table row
function thingsForTable(thing) {
  var requestDelete = "NO";
  var requestedAppt = "NO";
  if (thing.requestDelete == true) {
    requestDelete = "YES";
  }
  if (thing.requestedAppt) {
    requestedAppt = "YES";
  }
  return [(thing["name"]["first-name"] + " " + thing["name"]["last-name"]),
    (thing["employeeName"]["first-name"] + " " + thing["employeeName"]["last-name"]),
    thing.date,
    thing.time,
    thing.type,
    requestDelete,
    requestedAppt
  ];
}

//make a row
function makeRow(type, values) {
  return $(`<tr><${type}>` + values.join(`</${type}><${type}>`) + `</${type}></${type}>`);
}

function showAdminAppointment(thing) {
  updateAppointmentObj = thing;
  $('#update-time').val(thing["time"]);
  $('#update-date').val(thing["date"]);
  $('#update-type').val(thing["type"]);
  getEmployeesForType('#update-type', '#updateEmployeeName');
  $('#updateEmployeeName').val(thing["employeeId"]);
  setPage('update-appointment');
}

//END OF TABLE functions

//UPDATE AND CREATE Appointments

//find full names for the object
function findFullName(id) {
  var usersList = userList.filter(user => {
    var searchTextbool = false;
    if (user["_id"] == id) {
      searchTextbool = true;
    }
    return searchTextbool;
  });
  return usersList;
}

//create the Appointment
function createAppointment() {
  var time = $("#appt-time").val();
  var date = $("#appt-date").val();
  var type = $("#appt-type").val();

  if (!time || !date || !type || !$("#patientName").val() || !$("#employeeName").val()) {
    alert("Error in Input, please double check that all fields are filled");
    return;
  }
  var patientName = findFullName($("#patientName").val())[0].name;
  var employeeName = findFullName($("#employeeName").val())[0].name;

  if ((!patientName || patientName == []) || (!employeeName || employeeName == [])) {
    alert("Error in Input, please double check that all fields are filled");
    return;
  }


  var appt = {
    date: date,
    time: time,
    type: type,
    userid: $("#patientName").val(),
    employeeId: $("#employeeName").val(),
    name: patientName,
    employeeName: employeeName
  }

  $.ajax({
    url: '/app/api/v1/admin/appointment',
    method: 'POST',
    data: {
      userSend: JSON.stringify(appt)
    },
    success: function(res) {
      if (res.hasOwnProperty('msg')) {
        alert(res.msg);
        return;
      }
      alert("Appointment has been created");
      $("#appt-time").val("");
      $("#appt-date").val("");
      $("#appt-type").val("");
      $("#employeeName").val("");
      $('#patientName').val("");
      retrieveAllAppointments();
      setPage("admin-home")
    }
  });
}

//This function is for updating Appointments
function updateAppointment() {


  var date = $("#update-date").val();
  var time = $("#update-time").val();
  var type = $("#update-type").val();
  if(!date || !time || !type || !$("#updateEmployeeName").val()){
    alert("please fill out all fields");
    return;
  }
  var employeeName = findFullName($("#updateEmployeeName").val())[0].name;

  updateAppointmentObj["time"] = time;
  updateAppointmentObj["date"] = date;
  updateAppointmentObj["type"] = type;
  updateAppointmentObj["employeeName"] = employeeName;
  updateAppointmentObj["employeeId"] = $("#updateEmployeeName").val();

  $.ajax({
    url: '/app/api/v1/admin/appointment',
    method: 'PUT',
    data: {
      userSend: JSON.stringify(updateAppointmentObj)
    },
    success: function(res) {
      if (res.hasOwnProperty('msg')) {
        alert(res.msg);
        return;
      }
      retrieveAllAppointments();
      alert(res);
      setPage('admin-home');
    }
  });
}

//This function is for deleting appointments
function deleteAppointment() {
  var date = $("#update-date").val();
  var time = $("#update-time").val();
  var type = $("#update-type").val();
  var employeeName = findFullName($("#updateEmployeeName").val())[0].name;

  updateAppointmentObj["time"] = time;
  updateAppointmentObj["date"] = date;
  updateAppointmentObj["type"] = type;
  updateAppointmentObj["employeeName"] = employeeName;

  $.ajax({
    url: '/app/api/v1/admin/appointment',
    method: 'DELETE',
    data: {
      userSend: JSON.stringify(updateAppointmentObj)
    },
    success: function(res) {
      if (res.hasOwnProperty('msg')) {
        alert(res.msg);
        return;
      }
      else{
        alert("Successfully Deleted");
      }
      setPage('admin-home');
      retrieveAllAppointments();
    }
  });
}

//This function is for the admin creating users
function createUser() {
  var firstName = $("#firstName").val();
  var lastName = $("#lastName").val();
  var email = $("#email").val();
  var password = $("#password").val();
  var role = $("#role").val();

  if(!firstName || !lastName || !email || !password || !role){
    alert("please fill out all fields");
    return;
  }

  var user = {
    name: {
      "first-name": firstName,
      "last-name": lastName
    },
    email: email,
    password: password,
    role: role,
    enabled: true
  };

  $.ajax({
    url: '/app/api/v1/admin/user',
    method: 'POST',
    data: {
      userSend: JSON.stringify(user)
    },
    success: function(res) {
      if (res.hasOwnProperty('msg')) {
        alert(res.msg);
        return;
      }
      $("#firstName").val("");
      $("#lastName").val("");
      $("#email").val("");
      $("#password").val("");
      $("#role").val("");
      alert("User has been created");
      getAllUsers("");
      setPage("admin-home");
    },
    error: function(res){
      console.log(res)
      if (res.responseJSON.hasOwnProperty('msg')) {
        alert(res.responseJSON.msg);
        return;
      }
    }
  });
}

//This function is for disabling USERS
function deleteUser(u) {
  if (u.enabled) {
    u.enabled = false;
  } else {
    u.enabled = true;
  }

  $.ajax({
    url: '/app/api/v1/admin/user',
    method: 'PUT',
    data: {
      userSend: JSON.stringify(u)
    },
    success: function() {
      setPage('users-list');
    }
  });
}

//NEW FUNCTIONS ADDED FOR BETTER FUNCTIONALITY
function refreshAdminPage() {
  retrieveAllAppointments();
  getAllUsers();
}

//search Users function
function searchUsers() {
  var fieldText = document.getElementById("search").value.trim().toLowerCase();

  //filters the tasks according to user input

  var searchUsers = currentAppointments.filter(appointment => {
    var fullPatientName = appointment.name["first-name"] + " " + appointment.name["last-name"];
    var fullEmployeeName = appointment.employeeName["first-name"] + " " + appointment.employeeName["last-name"];

    var searchTextbool = false;
    if ((appointment.name["first-name"].toLowerCase().indexOf(fieldText) >= 0) ||
      (appointment.name["last-name"].toLowerCase().indexOf(fieldText) >= 0)) {
      searchTextbool = true;
    }
    if ((appointment.employeeName["first-name"].toLowerCase().indexOf(fieldText) >= 0) ||
      (appointment.employeeName["last-name"].toLowerCase().indexOf(fieldText) >= 0)) {
      searchTextbool = true;
    }

    if (fullPatientName.toLowerCase().indexOf(fieldText) >= 0 ||
      fullEmployeeName.toLowerCase().indexOf(fieldText) >= 0) {
      searchTextbool = true;
    }
    if (appointment.type.toLowerCase().indexOf(fieldText) >= 0) {
      searchTextbool = true;
    }

    return searchTextbool;
  });
  fillAdminTable(searchUsers);

}

//This function is for PATIENTS initializing their appointment list
function initializeUserAppList() {
  var appTable = $("#apptTable").empty();
  appTable.append("<tr><th>Date</th><th>Patient</th><th>Employee</th><th>Type</th><th>Time</th><th>Requested To Cancel</th><th>Requested Appointment</th>");
  currentAppointments.forEach(appt => {
    var delClass = "nonRequested";
    var requestedClass = "nonRequested";
    var requestedAppt = "No";
    var requestedDelete = "No";
    if (appt.requestDelete == true) {
      delClass = "requested";
      requestedDelete = "Requested";
    }
    if (appt.requestedAppt == true) {
      requestedClass = "requested";
      requestedAppt = "Requested";
    }
    appTable.append('<tr onclick=requestAppointmentDelete("' + appt._id +
      '")><td>' + appt.date + "</td><td>" +
      appt.name["first-name"] + " " + appt.name["last-name"] + "</td><td>" +
      appt.employeeName["first-name"] + " " + appt.employeeName["last-name"] +
      '</td><td>' + appt.type + '</td><td>' + processTime(appt.time) + '</td><td id=' + delClass + '>' + requestedDelete +
      '</td><td id=' + requestedClass + '>' + requestedAppt + '</td></tr>');
  });
}

//This function is for PATIENTS requesting to delete appointments
function requestAppointmentDelete(id) {

  var apptid = {
    "_id": id
  };

  $.ajax({
    url: '/app/api/v1/users/appointment',
    method: 'PUT',
    data: {
      userSend: JSON.stringify(apptid)
    },
    success: function(res) {
      if (res.hasOwnProperty('msg')) {
        alert(res.msg);
        return;
      }
      retrieveAppointments();
      alert("Request Successfully Changed");
    }
  });

}

//function that requests a patient appointment
function requestPatientAppointment() {
  var time = $("#request-time").val();
  var date = $("#request-date").val();
  var type = $("#request-type").val();
  var patientName = {
    "first-name": currentUser.name["first-name"],
    "last-name": currentUser.name["last-name"]
  };



  if (!time || !date || !type) {
    alert("Error in Input, please double check that all fields are filled");
    return;
  }

  //setup appt obj
  var appt = {
    date: date,
    time: time,
    type: type,
    userid: currentUser._id,
    employeeId: "",
    name: patientName,
    employeeName: {
      "first-name": "Requested",
      "last-name": "Appointment"
    },
    requestedAppt: true
  }

  $.ajax({
    url: '/app/api/v1/users/appointment',
    method: 'POST',
    data: {
      userSend: JSON.stringify(appt)
    },
    success: function(res) {
      if (res.hasOwnProperty('msg')) {
        alert(res.msg);
        return;
      }
      alert("Appointment has been requested");
      $("#update-time").val("");
      $("#update-date").val("");
      $("#update-type").val("");
      retrieveAppointments();
      setPage("user-home");
    }
  });
}
