'use strict';
// all dynamical helper equations

// constansts
const fMass = 0.01; // KG, mass of ping pong
const fForce = 1; // Newton, force of launcher
const fTime = 0.25; // seconds, time of launch (NOT the hangtime of the ball as it is in flight!)
const fVelocity_0 = 1.0; // m/s, the initial velocity of the ball at max servo speed (can be changed later)
const fVelocityMax = 4.1 // m/s, the max velocity assuming 5cm rotor diameter and 5000 RPM at max speed
const fGravity = 9.80723; // m/s^2, from https://www.sensorsone.com/local-gravity-calculator/ with latitude 47.602303 and height 427 meters (bregenz)
// TODO: drag? probably only matters for long shots

// back out velocity from time and force of launcher (as alternative to just knowing the velocity)
let v_0 = fTime*fForce / fMass;

function getMaxHeight() {
  console.log('in get max height');
  return (0.5*fVelocity_0^2 / fGravity).toFixed(2); // newtonian mecanics; peak of trajectory (TODO: do we need to offset by cup height?)
}

function getTheta(fTargetCupX) {
  console.log(fTargetCupX);
  return (Math.atan(getMaxHeight() / (fTargetCupX / 2)) * 180 / Math.PI).toFixed(2); // Omega, the x direction angle aka "up or down" of the launcher; the tangent of the max height of the tragectory over the distance of the ball
}

function getPhi(fTargetCupX, fTargetCupY) {
  console.log(fTargetCupX);
  console.log(fTargetCupY);
  return (Math.atan(fTargetCupY / fTargetCupX) * 180 / Math.PI).toFixed(2); // Phi, the y direction angle aka "left or right" of the launcher; the tangent of the y distance of the cup from the center axis of the launcher over the x distance of the cup from the launcher
}

exports.getTheta = getTheta;
exports.getPhi = getPhi;
exports.getMaxHeight = getMaxHeight;
exports.fVelocity_0 = fVelocity_0;
