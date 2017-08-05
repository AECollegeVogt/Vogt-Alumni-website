var winston = require('winston');
var Slack = require('./slack.js').Slack;
var config = require('../config-example');

// Creates and returns a new logging instance
module.exports = () => (new winston.Logger({
  'transports': [
    new (winston.transports.Console)({
      'level': 'debug',
      'handleExceptions': false,
      'json': false,
      'colorize': true,
      'timestamp': true
    }),
    new (Slack)({
      channel: '#random',
      webhookUri: 'https://hooks.slack.com/services/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',//tried to use config.slack.webhookUri here but didn't work
      username: 'dianetobit',
      level: 'error'
    })
  ],
  'exitOnError': false
}));