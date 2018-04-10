const chuck = require('chuck-norris-jokes');
const say = require('say');

postJoke = (req, res) => {
   chuck.hitme().then((sChuckNorrisJoke) => {
     say.speak(sChuckNorrisJoke); // speak the joke!
   });
}

exports.postJoke = postJoke;

// speak a joke endpoint
// routes.post('/joke', function (req,res) {
//   chuck.hitme().then((sChuckNorrisJoke) => {
//     say.speak(sChuckNorrisJoke); // speak the joke!
//   });
// });

// set theta endpoint

// set phi endpoint
