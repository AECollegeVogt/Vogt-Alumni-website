var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  	type: Number,
  	required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w.+-]*\w+@[\w-]+(\.[\w-]+)+$/, 'Please enter a valid email.']
  },
  description: {
    type: Schema.ObjectId,
    ref: 'Survey'
  },
  submittedSurvey: Boolean
});

module.exports = mongoose.model('User', userSchema);