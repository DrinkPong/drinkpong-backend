'use strict';
const say = require('say');
// our DrinkPong Bot class - setting the target cup will automatically update our servos to the target
// (or alternatevely, you can set the velocity, theta, and )
class DrinkPongBot {
  constructor(fTheta, fPhi, fVelocity_0, fTargetCupX, fTargetCupY) {
    this.oThetaServo = new five.Servo({
      pin: 10,
      startAt: fTheta,
      range: [35, 55]
    });
    this.oPhiServo = new five.Servo({
      pin: 11,
      startAt: fPhi,
      range: [0, 30]
    });
    this.oLauchServoLeft = new five.Servo({
      pin: 12,
      type: "continuous"
    });
    this.oLauchServoRight = new five.Servo({
      pin: 13,
      type: "continuous"
    });
    this.oLaunchLeverServo = new five.Servo({
      pin: 14,
      startAt: 0,
      range:[0,45]
    });
    this.oLaunchLeverServo.on('move:complete', this.launchLeverServoCompleteHandler); // register complete event for the launch servo
    this.fTheta = fTheta;
    this.fPhi = fPhi;
    this.fVelocity_0 = fVelocity_0;
    this.fTargetCupX = fTargetCupX;
    this.fTargetCupY = fTargetCupY;

  }
  // setters on the two angles - when they are updated, we need to issue a command to the servos so they are also updated
  set fTheta(fTheta) {
    say.speak("Setting my theta as well as the servo angle.");
    this.oThetaServo.to(fTheta);
  }
  set fPhi(fPhi) {
    say.speak("Setting my phi as well as the servo angle.");
    this.oPhiServo.to(fTheta);
  }
  set fVelocity_0(fVelocity_0) {
    say.speak("Setting my launch velocity, including lauching servo speed.");
    let fVelocityNormalized = fVelocity / this.fVelocity_0; // always between 0 and 1
    // if we have two further servos as a tennis-ball type launcher, one must be moved clockwise, the right one counter clockwise (in direction of ping pong travel)
    this.oLauchServoLeft.ccw(fVelocityNormalized);
    this.oLauchServoRight.cw(fVelocityNormalized);
  }
  targetCup() {
    say.speak("Setting my theta and phi, as well as those servo angles.");
    this.fTheta = getTheta(this.fTargetCupX);
    this.fPhi = getPhi(this.fTargetCupX, this.fTargetCupY);
  }
  // push a ball forward into the launcher!
  launch() {
    say.speak("Launching.");
    this.oLaunchLeverServo.to(45,1000);
  }
  // reset launch servo arm
  launchLeverServoCompleteHandler() {
    say.speak("Returning launch lever to initial position.");
    this.oLaunchLeverServo.to(0);
  }
}

module.exports = DrinkPongBot;
