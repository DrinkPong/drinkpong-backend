const cors = require('cors')
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
var http = require('http').Server(app);
//var oIO = require('./utils/io').initialize(http);
var oIO = require('socket.io')(http); // http side of socket

// TODO: feed the io instance into the bot! jaho!!!
const DrinkPongBot = require('./utils/DrinkPongBot');

// board and johnny five logic moved to class constructor

var five = require("johnny-five");
var board = new five.Board({
 // port: "/dev/ttyUSB0"
 port: "/dev/tty.wchusbserial1420"
});
let drinkPongBot, fTheta, fPhi;
board.on("ready", function() { // instantiating the drink pong bot inside of the board.on ready function will allow our class sto access the servo methods

  oThetaServo = new five.Servo({
    pin: 9
  });
  oPhiServo = new five.Servo({
    pin: 10
  });
  oLaunchLeverServo = new five.Servo({
    pin: 11
  });
  oLaunchMotorLeft = new five.Motor({
    pin: 5
  });
  oLaunchMotorRight = new five.Motor({
    pin: 6
  });

  oDrinkPongBot = new DrinkPongBot(0,0,0,0,0, true, oIO, oThetaServo, oPhiServo, oLaunchLeverServo, oLaunchMotorLeft, oLaunchMotorRight); // theta (degrees), phi (degrees), velocity (m/s) // create an instance of the DrinkPong Bot:


  // fTheta, fPhi, fVelocity_0, fTargetCupX, fTargetCupY, bWithBoard
  //const oDrinkPongBot = new DrinkPongBot(45.4,15.3,1,0.5,0.1,false, oIO); // don't try to use johnny 5 logic or board (false)
  var configureRouter = require('./configureRouter');
  var routes = configureRouter(oDrinkPongBot, oIO); // pass the robot class and socket down

  // CORS
  app.use(cors());

  // bodyParser to get posts from $.ajax
  app.use(bodyParser.json());

  // Setup logger
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

  // all routes of http (GET and POST)
  app.use(routes); // pass the drinkpongbot clob

  http.listen(3000);
});
