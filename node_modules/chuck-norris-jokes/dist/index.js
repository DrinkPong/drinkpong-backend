'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL = 'https://api.chucknorris.io/jokes/random';

exports.default = {
  hitme: function hitme() {
    return (0, _requestPromise2.default)({ url: URL, json: true }).then(function (response) {
      return response.value || null;
    });
  }
};
