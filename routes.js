var express = require('express');
var getRoutes = require('./routes/get');
var postRoutes = require('./routes/post');
var router = express.Router();

// get routes
// router.get(getRoutes.getTheta);
// router.get(getRoutes.getPhi);

// post routes
router.post('/postJoke', postRoutes.postJoke);

module.exports = router;
