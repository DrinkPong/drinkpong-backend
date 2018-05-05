'use strict';

function configureRouter(oDrinkPongBot, oIO) {
  
  // requires
  var express = require('express');
  var configureGetRoutes = require('./routes/configureGetRoutes');
  var configurePostRoutes = require('./routes/configurePostRoutes');
  var getRoutes = configureGetRoutes(oDrinkPongBot, oIO); // pass the drinkPongBot instance into the get routes
  var postRoutes = configurePostRoutes(oDrinkPongBot, oIO); // and the post routes too
  var router = express.Router(); // the actual router object
  
  // get routes
  // router.get('/getCupCoordinatesFromCamera', getRoutes.getCupCoordinatesFromCamera);

  // post routes
  router.post('/postJoke', postRoutes.postJoke);
  router.post('/postChuckNorrisJoke', postRoutes.postChuckNorrisJoke);
  router.post('/postTheta', postRoutes.postTheta);
  router.post('/postPhi', postRoutes.postPhi);
  router.post('/postTargetCupCoordinates', postRoutes.postTargetCupCoordinates);
  router.post('/postLaunch', postRoutes.postLaunch);
  router.post('/postCupMade', postRoutes.postCupMade);
  router.post('/postCupCoordinatesFromCamera', postRoutes.postCupCoordinatesFromCamera);
  router.post('/postMotorSpeedPercent', postRoutes.postMotorSpeedPercent);
  
  
  return router; // return the middleware object otherwise express rages
  
}

module.exports = configureRouter;
