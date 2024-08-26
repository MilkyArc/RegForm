const { parseCookies } = require('./utils');
const { generateSessionId, sessions, captchaChallenges } = require('./session');  
const { verifyUser } = require('./authUtils'); 

function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            //console.log('Received body:', body); 
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

            const { email, password } = data;
            if (!email || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Email and password are required' }));
                return;
            }

            verifyUser(email, password, (err, user) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error' }));
                } else if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid email or password' }));
                } else {
                    const newSessionId = generateSessionId();
                    sessions[newSessionId] = 
                    { userId: user.id, 
                      email: user.email,
                      firstName: user.firstName,
                      lastName: user.lastName 

                    };
     
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `sessionId=${newSessionId}; HttpOnly; Path=/; SameSite=Strict`
                    });
                    res.end(JSON.stringify({ message: 'Login successful' }));

                   
                    delete captchaChallenges[captchaId];
                }
            });
        } catch (parseError) {
           // console.error('JSON parsing error:', parseError.message); 
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON data' })); 
        }
    });
}

module.exports = { handleLogin };
