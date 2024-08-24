const path = require('path');
const { serveStaticFile } = require('./utils');
const { handleRegistration } = require('./register');
const { handleLogin } = require('./login');
const { handleLogout } = require('./logout');
const { handleChangeName, handleChangePassword } = require('./changeUserData');
const { parseCookies } = require('./utils');
const { getSession, isValidSession, serveCaptcha } = require('./session');


function handleRequest(req, res, pathName) {
    const cookies = parseCookies(req);
    const sessionId = cookies.sessionId;
    const userSession = getSession(sessionId);

    if (pathName === '/' && req.method === 'GET') {
        serveStaticFile(res, path.join(__dirname, '../client/register.html'), 'text/html');
    } else if (pathName === '/register.html' && req.method === 'GET') {
        serveStaticFile(res, path.join(__dirname, '../client/register.html'), 'text/html');
    } else if (pathName === '/login.html' && req.method === 'GET') {
        serveStaticFile(res, path.join(__dirname, '../client/login.html'), 'text/html');
    } else if (pathName === '/dashboard.html' && req.method === 'GET') {
        if (userSession && isValidSession(sessionId)) {
            res.setHeader('Cache-Control', 'no-store');
            serveStaticFile(res, path.join(__dirname, '../client/dashboard.html'), 'text/html');
        } else {
            res.writeHead(302, { 'Location': '/login.html' });
            res.end();
        }
    } else if (pathName === '/styles.css' && req.method === 'GET') {
        serveStaticFile(res, path.join(__dirname, '../client/styles.css'), 'text/css');
    } else if (pathName === '/script.js' && req.method === 'GET') {
        serveStaticFile(res, path.join(__dirname, '../client/script.js'), 'application/javascript');
    } else if (pathName === '/register' && req.method === 'POST') {
        handleRegistration(req, res);
    } else if (pathName === '/login' && req.method === 'POST') {
        handleLogin(req, res);
    } else if (pathName === '/logout' && req.method === 'POST') {
        handleLogout(req, res);
    } else if (pathName === '/captcha' && req.method === 'GET') {
        serveCaptcha(req, res);
    } else if (pathName === '/change-name' && req.method === 'POST') {
        handleChangeName(req, res);
    } else if (pathName === '/change-password' && req.method === 'POST') {
        handleChangePassword(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

module.exports = { handleRequest };
