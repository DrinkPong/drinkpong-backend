'use strict';
const say = require('say-promise');
const chuck = require('chuck-norris-jokes');
// var five = require("johnny-five");
// var board = new five.Board();
const dynamics = require('./dynamics');
const utils = require('./utils');
const async = require('async');
const jokes = require('../data/jokes');
//var socket = require('../utils/io').io(); // see ./utils/io file for more info - by the time we get here in our DrinkPongBot class the socket will have already be instantiated

var q = async.queue(function(task, callback) {
    console.log(task.sTextToSpeak);
    say.speak(task.sTextToSpeak, 'Alex', 1.0).then(() => {
      callback();
    }).catch(function () {
         console.log("Promise Rejected! One of your speak enqueuing functions is weird! Check yo code!");
         callback();
    });
}, 1);
// our DrinkPong Bot class - setting the target cup will automatically update our servos to the target
// (or alternatevely, you can set the velocity, theta, and )
class DrinkPongBot {
  constructor(fTheta, fPhi, fVelocity_0, fTargetCupX, fTargetCupY, bWithBoard, oIO, oThetaServo, oPhiServo, oLaunchLeverServo, oLaunchMotorLeft, oLaunchMotorRight) {
    q.push({sTextToSpeak: "Initializing."});

    this.bWithBoard = bWithBoard;
    this.oThetaServo = oThetaServo;
    this.oPhiServo = oPhiServo;
    this.oLaunchLeverServo = oLaunchLeverServo;
    this.oLaunchMotorLeft = oLaunchMotorLeft;
    this.oLaunchMotorRight = oLaunchMotorRight;
    this.fTheta = fTheta;
    this.fPhi = fPhi;
    this.fVelocity_0 = fVelocity_0;
    this.fTargetCupX = fTargetCupX;
    this.fTargetCupY = fTargetCupY;
    this.iBotScore = 0;
    this.iHumanScore = 0;
    this.aCupsRemainingBot = [true,true,true,true,true,true,true,true,true,true];
    this.aCupsRemainingHuman = [true,true,true,true,true,true,true,true,true,true];
    this.fVelocityMax = 4.16; // theoretical max velocity
    this.fMotorSpeedPercent = 70;
    this.oIO = oIO;
    this.oLaunchLeverServo.to(180);
    q.push({sTextToSpeak: "Initialization complete. Awaiting commands from UI or info from Pi."});
    this.oIO.emit('drinkPongBotInitialized', {sTheta: fTheta.toString(), });
  }
  // setters on the two angles - when they are updated, we need to issue a command to the servos so they are also updated
  set fTheta(fTheta) {
    q.push({sTextToSpeak: "Setting theta to " + fTheta.toString() + " degrees."});
    if (this.bWithBoard) {
      this.oThetaServo.to(fTheta);
    }
  }
  set fPhi(fPhi) {
    q.push({sTextToSpeak: "Setting phi to " + fPhi.toString() + " degrees."});
    if (this.bWithBoard) {
      this.oPhiServo.to(fPhi);
    }
  }
  set fVelocity_0(fVelocity_0) {
    q.push({sTextToSpeak: "Setting my launch velocity to " + fVelocity_0 + " meters per second."});

    // ensure that we don't blow the motor up
    if (fVelocity_0 > this.fVelocityMax) {
      fVelocity_0 = fVelocityMax;
    }

    this.fMotorSpeedPercent =  this.fVelocity_0 / this.fVelocityMax; // always between 0 and 1
  }
  set fTargetCupX(fTargetCupX) {
    q.push({sTextToSpeak: "Target cup x distance set to " + fTargetCupX.toString() + " meters."});
  }
  set fTargetCupY(fTargetCupY) {
    q.push({sTextToSpeak: "Target cup y distance set to " + fTargetCupY.toString() + " meters."});
  }
  targetCup(bLaunchAfterTargetLock, fTargetCupX, fTargetCupY) {
    console.log(bLaunchAfterTargetLock);
    this.fTargetCupX = fTargetCupX;
    this.fTargetCupY = fTargetCupY;
    q.push({sTextToSpeak: "Setting theta and phi!"});
    this.fTheta = dynamics.getTheta(fTargetCupX);
    this.fPhi = dynamics.getPhi(fTargetCupX, fTargetCupY);
    q.push({sTextToSpeak: "Target is locked on!"});
    q.push({sTextToSpeak: "Ready to shoot!"});
    if (bLaunchAfterTargetLock) { // also launch if checkbox is checked on frontend
      console.log("inside if!");
      setTimeout(function () {
        this.launch();
      }, 2000);
    }
    this.oIO.emit('cupTargetCoordinatesSetEvent', {sTargetCupX: fTargetCupX, sTargetCupY: fTargetCupY});
    this.oIO.emit('thetaSetEvent', {sTheta: dynamics.getTheta(fTargetCupX)});
    this.oIO.emit('phiSetEvent', {sPhi: dynamics.getPhi(fTargetCupX, fTargetCupY)});
  }
  // push a ball forward into the launcher!
  launch() {
    q.push({sTextToSpeak: "Launching!"});
    if (this.bWithBoard) {
	     var that = this;
      // jump start the motors
      q.push({sTextToSpeak: "Jump starting and spooling up."});
      //this.jumpStartMotors();

      // after 100 ms jump start, set the actual desired speed
      setTimeout(function() {
        that.startMotors();
      }, 500);

      // after 3 seconds, push the ball into the cannon
      setTimeout(function() {
        q.push({sTextToSpeak: "Pushing ball into cannon!"});
        that.oLaunchLeverServo.to(0);
      }, 2000);

    	setTimeout(function() {
    	that.stopMotors()
    	},3000);

    }
  }
  startMotors() {
    if (this.bWithBoard) {
      console.log(this.fMotorSpeedPercent);
  	this.oLaunchMotorLeft.start(this.fMotorSpeedPercent*255);
    this.oLaunchMotorRight.start(this.fMotorSpeedPercent*255);
      }
  }

  jumpStartMotors() {
    // always need to jumpstart motors
    this.oLaunchMotorLeft.start(255);
    this.oLaunchMotorRight.start(255);
  }
  tellJoke() { // wrapper for our bot to use the say speak function
    // chuck.hitme().then((sChuckNorrisJoke) => {
    //   q.push({sTextToSpeak: sChuckNorrisJoke); // speak the jok}e!
    // });
    let sJokeText;
    let iAngerLevel = this.iBotScore - this.iHumanScore;
    // very angry
    if (-9 <= iAngerLevel && iAngerLevel < -6) {
      sJokeText = jokes.aVeryAngryJokes[utils.getRandomInt(0, jokes.aVeryAngryJokes.length) - 1];
    }
    // angry
    else if (-5 < iAngerLevel && iAngerLevel < -3) {
      sJokeText = jokes.aAngryJokes[utils.getRandomInt(0, jokes.aAngryJokes.length)];
    }
    // neutral
    else if (-2 < iAngerLevel && iAngerLevel < 2) {
      var iInt = utils.getRandomInt(0, jokes.aNeutralJokes.length);
      console.log(iInt);
      sJokeText = jokes.aNeutralJokes[iInt];
    }
    // happy
    else if (3 < iAngerLevel && iAngerLevel < 5) {
      sJokeText = jokes.aHappyJokes[utils.getRandomInt(0, jokes.aHappyJokes.length)];
    }
    // very happy
    else if (6 < iAngerLevel && iAngerLevel <= 9) {
      sJokeText = jokes.aVeryHappyJokes[utils.getRandomInt(0, jokes.aVeryHappyJokes.length)];
    }
    q.push({sTextToSpeak: sJokeText});
  }
  tellChuckNorrisJoke() { // wrapper for our bot to use the say speak function
    chuck.hitme().then((sChuckNorrisJoke) => {
      q.push({sTextToSpeak: sChuckNorrisJoke}); // speak the jok}e!
    });
  }
  cupMade(sPointFor, iCupIndex) {
    console.log('emitting cupMadeEvent');
    let iScore;
    if (sPointFor === "HUMAN") {
      if (this.aCupsRemainingHuman[iCupIndex] === false) {
        q.push({sTextToSpeak: "The human has already scored at this cup index, nice try trying to trick me!"});
      } else {
        this.iHumanScore = this.iHumanScore + 1;
        iScore = this.iHumanScore;
        this.aCupsRemainingHuman[iCupIndex] = false; // set this index to false
        q.push({sTextToSpeak: "The human just scored by making cup index " + iCupIndex.toString() + ". The " + sPointFor + " now has " + iScore.toString() + " points!"});
      }
    } else {
      if (this.aCupsRemainingBot[iCupIndex] === false) {
        q.push({sTextToSpeak: "The bot has already scored at this cup index, nice try trying to trick me!"});
      } else {
        this.iBotScore = this.iBotScore + 1;
        iScore = this.iBotScore;
        this.aCupsRemainingBot[iCupIndex] = false; // set this index to false
        q.push({sTextToSpeak: "The bot just scored by making cup index " + iCupIndex.toString() + ". The " + sPointFor + " now has " + iScore.toString() + " points!"});
      }
    }
    this.oIO.emit('cupMadeEvent', {sPointFor: sPointFor, iCupIndex: iCupIndex}); // emit event to UI regardless if it happened or not, the UI will remain in sync
  }
  setMotorSpeedPercent(sMotorSpeedPercent) {
    var iMotorSpeedPercent = parseInt(sMotorSpeedPercent);
    this.fMotorSpeedPercent = (iMotorSpeedPercent / 100 ).toFixed(2); // float with 2 decimal
      q.push({sTextToSpeak: "Motor speed set to " + sMotorSpeedPercent + " percent!"});
  }
  // stopMotors() {
  //   if (this.bWithBoard) {
  //     this.oLaunchMotorLeft.stop(); // stop the motors
  //     this.oLaunchMotorRight.stop();
  //     q.push({sTextToSpeak: "Motors stopped!"});
  //   }
  // }
  // reset launch servo arm
  stopMotors() {
    var that = this;
    if (this.bWithBoard) {
      // immediately stop motors; ball has launched
      q.push({sTextToSpeak: "Stopping launch motors!"});
      this.oLaunchMotorLeft.stop();
      this.oLaunchMotorRight.stop();
      // after 2 seconds, return the launch servo back to initial position
      setTimeout(function() {
        q.push({sTextToSpeak: "Returning launch lever to initial position."});
        that.oLaunchLeverServo.to(180); // return the launch servo back to initial position
      }, 2000);

      setTimeout(function() {
        q.push({sTextToSpeak: "Launch process should be done!"});
      }, 4000);
    }
  }
}

module.exports = DrinkPongBot;
