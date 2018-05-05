'use strict';

// configures the post routes of the express router - returns an object of functions which are equivalent to the request paths
function configurePostRoutes(oDrinkPongBot) {
  
  const utils = require('../utils/utils');
  
  return {
    // speak a joke endpoint
    postJoke: (req, res) => {
       oDrinkPongBot.tellJoke();
       res.end();
    },
    
    // speak a chuck norris joke
    postChuckNorrisJoke: (req, res) => {
       oDrinkPongBot.tellChuckNorrisJoke();
       res.end();
    },

    // set theta endpoint (updates the theta value of the oDrinkPongBot object AND the physical servo in the real world)
    postTheta: (req, res) => {
      console.log(req.body);
      oDrinkPongBot.fTheta = req.body.fTheta;
      res.end();
    },

    // set phi endpoint
    postPhi: (req, res) => {
      oDrinkPongBot.fPhi = req.body.fPhi;
      res.end();
    },

    // set target cup coordinates, and the angles will adjust automatically!
    postTargetCupCoordinates: (req, res) => {
      oDrinkPongBot.targetCup(req.body.bLaunchAfterTargetLock, req.body.fTargetCupX, req.body.fTargetCupY); // will calculate and set the two angles ( assuming constant velocity ), and launch if user wants
      res.end();
    },

    // send a launch signal (activate launch servo)
    postLaunch: (req, res) => {
      console.log("in post launch");
      oDrinkPongBot.launch(); // lauch a ball!
      res.end();
    },

    // (can be either simulated from the )
    postCupMade: (req, res) => {
      oDrinkPongBot.cupMade(req.body.sPointFor, req.body.iCupIndex);
      res.end();
    },
    
    postCupCoordinatesFromCamera: (req, res) => {
      // var options = {
      //   scriptPath: './',
      // }
      // PythonShell.run('calculatecoordinates.py', options, function (err, data) {
      //   console.log(err);
      //   console.log(data);
      //   oJSON = JSON.parse(fs.readFileSync('coordinates.json', 'utf8'));
      //   console.log(JSON.stringify(data[0]));
      //   if (err) res.send(err);
      //   res.send(JSON.stringify(oJSON));
      // });
      var fX = utils.getRandomFloat(0,1).toFixed(2);
      var fY = utils.getRandomFloat(0,0.25).toFixed(2);
      //oIO.emit('cupTargetCoordinatesSetEvent', {sTargetCupX: fX, sTargetCupY: fY}); 
      oDrinkPongBot.targetCup(req.body.bLaunchAfterTargetLock, fX, fY)
      res.end();
    },
    postMotorSpeedPercent: (req, res) => {
      oDrinkPongBot.setMotorSpeedPercent(req.body.sMotorSpeedPercent);
      res.end();
    },
    postStopMotors: (req, res) => {
      oDrinkPongBot.stopMotors();
      res.end();
    }
  }
}

module.exports = configurePostRoutes;
