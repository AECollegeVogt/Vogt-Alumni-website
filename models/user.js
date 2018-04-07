var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//modification : ajout de password, email_visibility, tel_visibility

let userSchema = new Schema({
  firstName: {
    type: String,
    maxLength: 35,
    required: true,
    match: [/^[a-zA-Z\u00C0-\u017F' -]+$/, 'Please enter valid name characters.']
  },
  lastName: {
    type: String,
    maxLength: 35,
    required: true,
    match: [/^[a-zA-Z\u00C0-\u017F' -]+$/, 'Please enter valid name characters.']
  },
  gender: {
    type: String,
    enum: ['F', 'M'],
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w.+-]*\w+@[\w-]+(\.[\w-]+)+$/, 'Please enter a valid email.']
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: Schema.ObjectId,
    ref: 'Survey'
  },
  submittedSurvey: Boolean,
  tel_visibility: Boolean,
  email_visibility: Boolean
});

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_WORK_FACTOR = 10;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    next();
    return;
  }

  // generate a salt and hash
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      next(err);
      return;
    }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        next(err);
        return;
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
