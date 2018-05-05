'use strict';

// configures the post routes of the express router - returns an object of functions which are equivalent to the request paths
function configureGetRoutes(oDrinkPongBot, oIO) {
    var PythonShell = require('python-shell');
    const utils = require('../utils/utils');

    return {
        getCupCoordinatesFromCamera: (req, res) => {
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
      } 
    }
  }
  // exports for this module
  module.exports = configureGetRoutes;
