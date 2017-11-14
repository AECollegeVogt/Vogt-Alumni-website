let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//modification : Ajout de statut
let surveySchema = new Schema({
    'country': String,
    'city': String,
    'from': String,
    'to': String,
    'level': String,
    'major': String,
    'statut': String,
    'linkedinUsername': String,
    'interests': [String],
    'more-interests': String,
    'experience': [String],
    'more-experiences': String
});

module.exports = mongoose.model('Survey', surveySchema);