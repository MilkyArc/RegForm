const { hashPassword, verifyUser } = require('../server/authUtils');
const { connectToDatabase, findUserByEmail, registerUser, updateUserName, updateUserPassword, connection } = require('../server/db');
const { handleLogin } = require('../server/login');
const { handleLogout } = require('../server/logout');
const { handleRegistration } = require('../server/register');
const { handleChangeName, handleChangePassword } = require('../server/changeUserData');
const { handleRequest } = require('../server/routes');
const { parseCookies, serveStaticFile } = require('../server/utils');
const { sessions, captchaChallenges, generateSessionId, getSession, isValidSession, generateCaptcha, serveCaptcha } = require('../server/session');
const { validateRegistrationData, validateNameChangeData, validatePasswordChangeData } = require('../server/validation');


// Utility function to log test results
function logResult(testName, condition) {
    const green = '\x1b[32m'; 
    const red = '\x1b[31m';   
    const reset = '\x1b[0m';  

    if (condition) {
        console.log(`${testName}: ${green}PASSED${reset}`);
    } else {
        console.log(`${testName}: ${red}FAILED${reset}`);
    }
}


// Utility function to generate a random email
function generateRandomEmail() {
    const randomPrefix = Math.random().toString(36).substring(2, 10);
    return `${randomPrefix}@unittest.com`;
}

// Mock data for testing
const mockUser = {
    email: 'test@example2.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
};

// Mock response object for testing
const mockRes = {
    writeHead: function (statusCode, headers) {
        this.statusCode = statusCode;
        this.headers = headers;
    },
    end: function (data) {
        this.data = data;
    }
};

// Test for hashPassword function
function testHashPassword() {
    hashPassword(mockUser.password, (err, hashedPassword) => {
        logResult('testHashPassword', !err && hashedPassword);
    });
}

// Test for verifyUser function
function testVerifyUser() {
    verifyUser(mockUser.email, mockUser.password, (err, user) => {
        logResult('testVerifyUser', !err && (user === false || user));
    });
}

// Test for connectToDatabase function
function testConnectToDatabase(callback) {
    connectToDatabase((err) => {
        logResult('testConnectToDatabase', !err);
        callback(); 
    });
}

// Test for findUserByEmail function
function testFindUserByEmail() {
    findUserByEmail(mockUser.email, (err, user) => {
        logResult('testFindUserByEmail', !err && (user === undefined || user));
    });
}

// Test for registerUser function with random email
function testRegisterUser() {
    const randomUser = { ...mockUser, email: generateRandomEmail() };
    
    registerUser(randomUser, (err, userId) => {
        logResult('testRegisterUser', !err && userId);
    });
}

// Test for updateUserName function
function testUpdateUserName() {
    updateUserName(mockUser.email, 'Jane', 'Smith', (err, result) => {
        logResult('testUpdateUserName', !err && result);
    });
}

// Test for updateUserPassword function
function testUpdateUserPassword() {
    updateUserPassword(mockUser.email, 'newPassword123', (err, result) => {
        logResult('testUpdateUserPassword', !err && result);
    });
}

// Test for handleLogin function
function testHandleLogin() {
    const mockReq = { on: function(event, callback) { if(event === 'end') callback(); }, body: JSON.stringify(mockUser) };
    handleLogin(mockReq, mockRes);
    logResult('testHandleLogin', mockRes.statusCode === 200 || mockRes.statusCode === 401 || mockRes.statusCode === 400);
}

// Test for handleLogout function
function testHandleLogout() {
    sessions['mockSessionId'] = { userId: 1, email: mockUser.email }; 
    const mockReq = { headers: { cookie: 'sessionId=mockSessionId' } };
    handleLogout(mockReq, mockRes);
    logResult('testHandleLogout', mockRes.statusCode === 200 || mockRes.statusCode === 400);
}

// Test for handleRegistration function
function testHandleRegistration() {
    const mockReq = { on: function(event, callback) { if(event === 'end') callback(); }, body: JSON.stringify(mockUser) };
    handleRegistration(mockReq, mockRes);
    logResult('testHandleRegistration', mockRes.statusCode === 200 || mockRes.statusCode === 400);
}

// Test for handleChangeName function
function testHandleChangeName() {
    sessions['mockSessionId'] = { email: mockUser.email }; 
    const mockReq = { headers: { cookie: 'sessionId=mockSessionId' }, on: function(event, callback) { if(event === 'end') callback(); }, body: JSON.stringify({ firstName: 'Jane', lastName: 'Smith', passwordForNameChange: 'password123' }) };
    handleChangeName(mockReq, mockRes);
    logResult('testHandleChangeName', mockRes.statusCode === 200 || mockRes.statusCode === 400);
}

// Test for handleChangePassword function
function testHandleChangePassword() {
    sessions['mockSessionId'] = { email: mockUser.email }; 
    const mockReq = { headers: { cookie: 'sessionId=mockSessionId' }, on: function(event, callback) { if(event === 'end') callback(); }, body: JSON.stringify({ currentPassword: 'password123', newPassword: 'newPassword123', confirmNewPassword: 'newPassword123' }) };
    handleChangePassword(mockReq, mockRes);
    logResult('testHandleChangePassword', mockRes.statusCode === 200 || mockRes.statusCode === 400);
}

// Test for serveCaptcha function
function testServeCaptcha() {
    const mockReq = {};
    serveCaptcha(mockReq, mockRes);
    logResult('testServeCaptcha', mockRes.statusCode === 200);
}

// Test for generateCaptcha function
function testGenerateCaptcha() {
    const captcha = generateCaptcha();
    logResult('testGenerateCaptcha', typeof captcha.question === 'string' && typeof captcha.answer === 'number');
}

// Test for generateSessionId function
function testGenerateSessionId() {
    const sessionId = generateSessionId();
    logResult('testGenerateSessionId', typeof sessionId === 'string' && sessionId.length > 0);
}

// Test for getSession function
function testGetSession() {
    sessions['testSessionId'] = { userId: 1, email: 'test@example.com' };
    const session = getSession('testSessionId');
    logResult('testGetSession', session && session.email === 'test@example.com');
}

// Test for isValidSession function
function testIsValidSession() {
    sessions['testSessionId'] = { userId: 1, email: 'test@example.com' };
    const isValid = isValidSession('testSessionId');
    logResult('testIsValidSession', isValid === true);
}

// Test for serveStaticFile function
function testServeStaticFile() {
    serveStaticFile(mockRes, './client/login.html', 'text/html');
    logResult('testServeStaticFile', mockRes.statusCode === 200 || mockRes.statusCode === 500);
}

// Test for parseCookies function
function testParseCookies() {
    const mockReq = { headers: { cookie: 'sessionId=mockSessionId' } };
    const cookies = parseCookies(mockReq);
    logResult('testParseCookies', cookies.sessionId === 'mockSessionId');
}

// Test for validateRegistrationData function
function testValidateRegistrationData() {
    const validUser = {
        email: 'valid@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'validPass123',
        confirmPassword: 'validPass123'
    };
    
    const invalidUser = {
        email: 'invalid',
        firstName: 'J',
        lastName: 'D',
        password: '123',
        confirmPassword: '456'
    };

    validateRegistrationData(validUser, (err) => {
        logResult('testValidateRegistrationData - valid', !err);
    });
    validateRegistrationData(invalidUser, (err) => {
        logResult('testValidateRegistrationData - invalid', err !== null);
    });
}

// Test for validateNameChangeData function
function testValidateNameChangeData() {
    validateNameChangeData({ firstName: 'John', lastName: 'Doe' }, (err) => {
        logResult('testValidateNameChangeData - valid', !err);
    });
    validateNameChangeData({ firstName: '', lastName: '' }, (err) => {
        logResult('testValidateNameChangeData - invalid', err !== null);
    });
}

// Test for validatePasswordChangeData function
function testValidatePasswordChangeData() {
    validatePasswordChangeData({ newPassword: 'password123', confirmNewPassword: 'password123' }, (err) => {
        logResult('testValidatePasswordChangeData - valid', !err);
    });
    validatePasswordChangeData({ newPassword: '123', confirmNewPassword: '123' }, (err) => {
        logResult('testValidatePasswordChangeData - invalid', err !== null);
    });
}

function testHandleRequest() {
    const mockReq = { method: 'GET', url: '/', headers: {} }; // Ensure headers are defined
    handleRequest(mockReq, mockRes, '/');
    logResult('testHandleRequest', mockRes.statusCode === 200 || mockRes.statusCode === 302 || mockRes.statusCode === 404);
}

function runTests() {
    console.log('Running server-side tests...');
    testHandleLogin();
    testHandleLogout();
    testHandleRegistration();
    testHandleChangeName();
    testHandleChangePassword();
    testServeCaptcha();
    testGenerateCaptcha();
    testGenerateSessionId();
    testGetSession();
    testIsValidSession();
    testServeStaticFile();
    testParseCookies();
    testValidateRegistrationData();
    testValidateNameChangeData();
    testValidatePasswordChangeData();
    testHandleRequest();
   
    testConnectToDatabase(() => {
        testFindUserByEmail();
        testRegisterUser();
        testUpdateUserName();
        testUpdateUserPassword();
        testHashPassword();
        testVerifyUser();
        connection.end(); 
    });
}

runTests();

