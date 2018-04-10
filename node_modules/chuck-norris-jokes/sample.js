const chuck = require('./index');

chuck
  .hitme()
  .then(console.log.bind(console));
