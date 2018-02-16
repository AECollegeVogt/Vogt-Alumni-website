let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Survey = mongoose.model('Survey'),
    bcrypt = require('bcrypt');

exports.list_all_users = function(req, res) {
    User.find({}, { _id: 0, password: 0 }).populate('description').exec().then(users => {
        res.json(users);
    });
};

exports.read_a_user = function(req, res) {
    User.findById(req.params.userId).populate('description').exec().then(user => {
        res.json(user);
    });
};

exports.update_a_user = function(req, res) {
    User.findById(req.params.userId, (err, user) => {
        if (err) {
            res.status(500).send(err);
        } else {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.contact = req.body.contact;
            user.email = req.body.email;
            user.tel_visibility = req.body.tel_visibility;
            user.email_visibility = req.body.email_visibility;

            if (req.body.password != "") {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }

            Survey.findById(user.description, (err, survey) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    survey.major = req.body.description.major;
                    survey.statut = req.body.description.statut;
                    survey.city = req.body.description.city;
                    survey.country = req.body.description.country;
                    console.log(user.description);

                    survey.save((err, survey) => {
                        if (err) {
                            res.status(500).send(err);
                        }
                    })
                }
            });

            user.save((err, user) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(user);
            })
        }
    })
}