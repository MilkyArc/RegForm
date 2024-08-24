const bcrypt = require('bcrypt');
const { findUserByEmail } = require('./db'); 


function hashPassword(password, callback) {
    const saltRounds = 12;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }
        callback(null, hashedPassword);
    });
}


function verifyUser(email, password, callback) {
    findUserByEmail(email, (err, user) => {
        if (err) {
            return callback(err);
        }
        if (!user) {
            return callback(null, false);
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return callback(err);
            }
            callback(null, isMatch ? user : false);
        });
    });
}

module.exports = {
    hashPassword,
    verifyUser
};
