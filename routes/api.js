module.exports = function(app) {
    let userController = require('../controllers/controller');
    let config = require('../config');
    let jwt = require('jsonwebtoken');
    let bcrypt = require('bcrypt');
    let verifyToken = require('../utils/verify-token');
    let mongoose = require('mongoose'),
        User = mongoose.model('User');


    app.route('/directory-api/users')
        .get(userController.list_all_users);

    app.route('/directory-api/users/:userId')
        .get(verifyToken, userController.read_a_user)
        .put(verifyToken, userController.update_a_user);

    app.route('/directory-api/login')
        .post(function(req, res) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) return res.status(500).send('Error on the server.');
                if (!user) return res.status(404).send('No user found.');
                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token, id: user._id });
            });
        });
}