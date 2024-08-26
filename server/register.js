const { validateRegistrationData } = require('./validation');
const { findUserByEmail, registerUser } = require('./db');
const { parseCookies } = require('./utils');
const { captchaChallenges } = require('./session');  
const { hashPassword } = require('./authUtils'); 

function handleRegistration(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body); 

     
            const captchaId = parseCookies(req).captchaId;
            console.log('Captcha ID from cookies:', captchaId); 

        
            if (!captchaId || !captchaChallenges[captchaId]) {
                console.error('Invalid or missing CAPTCHA ID or challenge');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'CAPTCHA failed' }));
                return;
            }


            if (parseInt(data.captchaResponse, 10) !== captchaChallenges[captchaId].answer) {
                console.error('Incorrect CAPTCHA response');
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'CAPTCHA failed' }));
                return;
            }

            validateRegistrationData(data, (err) => {
                if (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                } else {
                    findUserByEmail(data.email, (err, user) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Database error' }));
                        } else if (user) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Email is already registered' }));
                        } else {
                            hashPassword(data.password, (err, hashedPassword) => {
                                if (err) {
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ error: 'Server error' }));
                                } else {
                                    const newUser = {
                                        firstName: data.firstName,
                                        lastName: data.lastName,
                                        email: data.email,
                                        password: hashedPassword
                                    };
                                    registerUser(newUser, (err, userId) => {
                                        if (err) {
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ error: 'Database error' }));
                                        } else {
                                            res.writeHead(200, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ message: 'Registration successful', userId }));
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } catch (parseError) {
            console.error('JSON parsing error:', parseError.message); 
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON data' })); 
        }
    });
}

module.exports = { handleRegistration };
