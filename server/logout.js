const { parseCookies } = require('./utils');
const { sessions } = require('./session');

function handleLogout(req, res) {
    const cookies = parseCookies(req);
    const sessionId = cookies.sessionId;

    if (sessionId && sessions[sessionId]) {

        delete sessions[sessionId];
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': 'sessionId=; Max-Age=0; HttpOnly; Path=/; SameSite=Strict'
        });
        res.end(JSON.stringify({ message: 'Logout successful' }));
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not logged in' }));
    }
}

module.exports = { handleLogout };
