'use strict';

const chuck = require('chuck-norris-jokes');
const say = require('say');
var DrinkPongBot = require('../utils/DrinkPongBot');
console.log(DrinkPongBot);
var five = require("johnny-five");
var board = new five.Board();
let drinkPongBot;
board.on("ready", function() { // instantiating the drink pong bot inside of the board.on ready function will allow our class sto access the servo methods
  drinkPongBot = new DrinkPongBot(45,15,0); // theta (degrees), phi (degrees), velocity (m/s) // create an instance of the DrinkPong Bot:
});

// speak a joke endpoint
const postJoke = (req, res) => {
   chuck.hitme().then((sChuckNorrisJoke) => {
     say.speak(sChuckNorrisJoke); // speak the joke!
   });
};

// set theta endpoint (updates the theta value of the drinkPongBot object AND the physical servo in the real world)
const postTheta = (req, res) => {
  drinkPongBot.fTheta = req.data.fTheta;
};

// set phi endpoint
const postPhi = (req, res) => {
  drinkPongBot.fPhi = req.data.fPhi;
};

// set target cup coordinates, and the angles will adjust automatically!
const postTargetCupCoordinates = (req, res) => {
  drinkPongBot.fTargetCupX = req.data.fTargetCupX;
  drinkPongBot.fTargetCupY = req.data.fTargetCupY;
  drinkPongBot.targetCup(); // will calculate and set the two angles ( assuming constant velocity )
  if (req.data.bLaunchAfterTargetLock) { // also launch if checkbox is checked on frontend
    drinkPongBot.launch();
  }
};

// send a launch signal (activate launch servo)
const postLaunch = (req, res) => {
  drinkPongBot.launch(); // lauch a ball!
};

exports.postJoke = postJoke;
exports.postTheta = postTheta;
exports.postPhi = postPhi;
exports.postTargetCupCoordinates = postTargetCupCoordinates;
