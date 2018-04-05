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
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w.+-]*\w+@[\w-]+(\.[\w-]+)+$/, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: false
    },
    description: {
        type: Schema.ObjectId,
        ref: 'Survey'
    },
    submittedSurvey: Boolean,
    tel_visibility: Boolean,
    email_visibility: Boolean
});

module.exports = mongoose.model('User', userSchema);