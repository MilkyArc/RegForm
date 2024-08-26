const bcrypt = require('bcrypt');
const { findUserByEmail } = require('./db'); 
const { parseCookies } = require('./utils');
const { getSession, isValidSession } = require('./session');



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

function handleUserDetails(req, res) {
    const cookies = parseCookies(req);
    const sessionId = cookies.sessionId;
    const userSession = getSession(sessionId);

    if (userSession && isValidSession(sessionId)) {
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ firstName: userSession.firstName, lastName: userSession.lastName }));
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not authenticated' }));
    }
}

module.exports = {
    hashPassword,
    verifyUser,
    handleUserDetails
};
