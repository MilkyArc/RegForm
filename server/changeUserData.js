const { verifyUser, hashPassword } = require('./authUtils');
const { updateUserName, updateUserPassword } = require('./db');
const { parseCookies } = require('./utils');
const { sessions } = require('./session');
const { validateNameChangeData, validatePasswordChangeData } = require('./validation');

function handleChangeName(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            console.log('Received body for name change:', body); 
            const data = JSON.parse(body); 
            const sessionId = parseCookies(req).sessionId;
            const userSession = sessions[sessionId];

            if (!userSession) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not authenticated' }));
                return;
            }

            validateNameChangeData(data, (err) => {
                if (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                }

                verifyUser(userSession.email, data.passwordForNameChange, (err, user) => {
                    if (err || !user) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid password' }));
                    } else {

                        updateUserName(userSession.email, data.firstName, data.lastName, (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Database error' }));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Name changed successfully' }));
                            }
                        });
                    }
                });
            });
        } catch (parseError) {
            console.error('JSON parsing error for name change:', parseError.message); 
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON data' })); 
        }
    });
}

function handleChangePassword(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            console.log('Received body for password change:', body); 
            const data = JSON.parse(body); 
            const sessionId = parseCookies(req).sessionId;
            const userSession = sessions[sessionId];

            if (!userSession) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not authenticated' }));
                return;
            }

            validatePasswordChangeData(data, (err) => {
                if (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                }

                verifyUser(userSession.email, data.currentPassword, (err, user) => {
                    if (err || !user) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid current password' }));
                    } else {

                        hashPassword(data.newPassword, (err, hashedPassword) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Server error' }));
                            } else {
                                updateUserPassword(userSession.email, hashedPassword, (err) => {
                                    if (err) {
                                        res.writeHead(500, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ error: 'Database error' }));
                                    } else {
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ message: 'Password changed successfully' }));
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } catch (parseError) {
            console.error('JSON parsing error for password change:', parseError.message); 
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON data' })); 
        }
    });
}

module.exports = {
    handleChangeName,
    handleChangePassword
};
