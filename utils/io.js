var sio = require('socket.io');
var io = null;

exports.io = function () {
  return io;
};

exports.initialize = function(server) {
  io = sio(server);
  io.on('connection', function(socket) {
    // io.emit('cupTargetCoordinatesSetEvent', {sTargetCupX: 100, sTargetCupY: 500});
    io.
  });
};
