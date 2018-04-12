'use strict';

var express = require('express');
var getRoutes = require('./routes/get');
var postRoutes = require('./routes/post');
var router = express.Router();

// get routes
// router.get('/getTheta', getRoutes.getTheta);
// router.get('/getPhi', getRoutes.getPhi);

// post routes
router.post('/postJoke', postRoutes.postJoke);
router.post('/postTheta', postRoutes.postJoke);
router.post('/postPhi', postRoutes.postJoke);
router.post('/postTargetCupCoordinates', postRoutes.postTargetCupCoordinates);

module.exports = router;
