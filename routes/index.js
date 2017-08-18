var https = require('https');
var config = require('../config');
var mongoose = require('mongoose');
var querystring = require('querystring');
var User = mongoose.model('User');
var Survey = mongoose.model('Survey');
var express = require('express');
var router = express.Router();

var logger = require('../logger/logger.js')();

mongoose.Promise = require('bluebird');

let ajaxResponse = JSON.stringify({
  'success': true,
  'emailValid': true,
  'errorMessage': ''
});

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Vogt Alumni'
  });
});

router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'Inscription | Vogt Alumni'
  });
});

router.get('/action', (req, res, next) => {
  res.render('action', {
    title: 'Manifestations | Vogt Alumni'
  });
});

router.get('/social', (req, res, next) => {
  res.render('social', {
    title: 'Vie Associative | Vogt Alumni'
  });
});

router.post('/join', (req, res, next) => {
    let response = JSON.parse(ajaxResponse);
    let body = req.body;

    let userObj = {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body['gender'],
      dateOfBirth: body.dateOfBirth,
      contact: body.contact,
      email: body.email
    };


	// Search for the user email.
    // Email exists? Update
    // Email original? Create new using upsert
    User.findOneAndUpdate({email: userObj.email}, userObj, {upsert: true, new: true}).exec().then((user) => {
      if (!user.submittedSurvey) {
        return new Survey({
          'country': body['country'],
      'city': body['city'],
		  'from': body['from'],
		  'to': body['to'],
		  'level': body['level'],
		  'major': body['major'],
		  'linkedinUsername': body['linkedinUsername'],
		  'interests': body.interests,
		  'more-interests': body['more-interests'],
		  'experience': body.experience,
		  'more-experiences': body['more-experiences']
        }).save().then((survey) => {
          user.description = survey;
          user.submittedSurvey = true;
          return user.save();
        });
      } else {
        logger.info('Updated existing user in MongoDB');
      }
    }).then((user) => {
      // Successful save
      logger.info('Successfully saved user in MongoDB');
      next() // Move to addToSlack
    }, (err) => {
      // Most likely validation error
      logger.error(`MongoDB: ${err.name}: ${err.message}`);
      response.success = false;
      response.errorMessage = Object.keys(err.errors).map((key) => err.errors[key].message).join(' ');
      res.status(400).json(response);
    });
}, (req, res, next) => {	
    // Slack actions
    let response = JSON.parse(ajaxResponse); // Get a copy
    addToSlack(req.body.email, (err, statusCode, invited) => {
      response.slackSuccess = !err && statusCode === 200;
      response.slackInvited = invited;
      res.status(statusCode).json(response);
    });
});
 
let addToSlack = (email, cb) => {
    // sends an invite to join the dvcoders slack channel
    // (error, statusCode, invited) is passed to the callback, but note that
    // slack sends a 200 even if the user has already been invited.
    // also note this api endpoint is "undocumented" and subject to change
    let data = querystring.stringify({
      email: email,
      token: config.slack.token,
      set_active: true
    });

    let options = {
      hostname: 'chimehack2017.slack.com',
      path: '/api/users.admin.invite',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    let req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (d) => {
        body += d;
      });
      res.on('end', () => {
        let resBody = JSON.parse(body);
        logger.info('Slack response:', res.statusCode, resBody);
        if (res.statusCode === 200 && !resBody.ok && (resBody.error === 'already_invited' || resBody.error === 'already_in_team')) {
          cb(null, 200, true);
        } else {
          cb(null, res.statusCode, false);
        }
      });
    });
    req.on('error', (err) => {
      logger.error(`Slack request error: ${err}`);
      cb(err, 500, false);
    });
    req.write(data);
    req.end();
};
module.exports = router;

