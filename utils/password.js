var bcrypt = require('bcrypt');
var generatePassword = function(nbCar) {
    var ListeCar = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", '*', '#', '$', '?', '&', '@');
    var Chaine = '';
    for (i = 0; i < nbCar; i++) {
        Chaine = Chaine + ListeCar[Math.floor(Math.random() * ListeCar.length)];
    }
    return Chaine;
}

/* var bcrypt = require('bcrypt');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("mon mot de passe", salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
bcrypt.compare("un autre mot de passe", hash, function(err, res) {
    // res == false
}); */

passe = generatePassword(25);
console.log(passe);
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(passe, salt, function(err, hash) {
        console.log(hash);
    })
});

console.log(hashed);