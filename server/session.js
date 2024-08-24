const crypto = require('crypto');
const { parseCookies } = require('./utils');

let sessions = {}; 
let captchaChallenges = {};  

module.exports = {
    sessions,
    captchaChallenges,
    generateSessionId,
    getSession,
    isValidSession,
    generateCaptcha,
    serveCaptcha
};


function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

function getSession(sessionId) {
    return sessions[sessionId];
}

function isValidSession(sessionId) {
    return sessions.hasOwnProperty(sessionId);
}


function generateCaptcha() {
    const sixDigitNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const firstDigitIndex = Math.floor(Math.random() * 6);
    let secondDigitIndex;
    do {
        secondDigitIndex = Math.floor(Math.random() * 6);
    } while (secondDigitIndex === firstDigitIndex);

    const digit1 = parseInt(sixDigitNumber[firstDigitIndex], 10);
    const digit2 = parseInt(sixDigitNumber[secondDigitIndex], 10);
    const challenge = {
        question: `What is the product of the ${ordinal(firstDigitIndex + 1)} and ${ordinal(secondDigitIndex + 1)} digits of ${sixDigitNumber}?`,
        answer: digit1 * digit2,
    };

    return challenge;
}

function ordinal(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function serveCaptcha(req, res) {
    const captchaId = generateSessionId(); 
    const captcha = generateCaptcha();

    captchaChallenges[captchaId] = { answer: captcha.answer };

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `captchaId=${captchaId}; HttpOnly; Path=/; SameSite=Strict`
    });
    res.end(JSON.stringify({ question: captcha.question }));
}
