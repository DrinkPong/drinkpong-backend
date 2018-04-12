'use strict';
// all dynamical helper equations

// constansts
const fMass = 0.01; // KG, mass of ping pong
const fForce = 1; // Newton, force of launcher
const fTime = 0.25; // seconds, time of launch (NOT the hangtime of the ball as it is in flight!)
const fVelocity_0 = 5; // m/s, the initial velocity of the
const fGravity = 9.80723; // m/s^2, from https://www.sensorsone.com/local-gravity-calculator/ with latitude 47.602303 and height 427 meters (bregenz)
// TODO: drag? probably only matters for long shots

// back out velocity from time and force of launcher (as alternative to just knowing the velocity)
v_0 = t*F_0 / fMass;

function getMaxHeight() {
  return 0.5*fVelocity_0^2 / fGravity; // newtonian mecanics; peak of trajectory (TODO: do we need to offset by cup height?)
}

function getTheta(fXCup) {
  return Math.tan(getMaxHeight() / (fXCup / 2)); // Omega, the x direction angle aka "up or down" of the launcher; the tangent of the max height of the tragectory over the distance of the ball
}

function getPhi(fXCup, fYCup) {
  return Math.tan(fYCup / fYCup); // Phi, the y direction angle aka "left or right" of the launcher; the tangent of the y distance of the cup from the center axis of the launcher over the x distance of the cup from the launcher
}

exports.getTheta = getTheta;
exports.getPhi = getPhi;
exports.getMaxHeight = getMaxHeight;
