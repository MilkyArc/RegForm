const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'reguser',
    password: 'password',
    database: 'registration'
});

function connectToDatabase(callback) {
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err.stack);
            return callback(err);
        }
        console.log('Connected to the database.');
        callback(null);
    });
}

function findUserByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results[0]);
    });
}


function registerUser(userData, callback) {
    const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    const values = [userData.firstName, userData.lastName, userData.email, userData.password];
    connection.query(query, values, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.insertId);
    });
}

function updateUserName(email, firstName, lastName, callback) {
    const query = 'UPDATE users SET firstName = ?, lastName = ? WHERE email = ?';
    connection.query(query, [firstName, lastName, email], (err, results) => {
        callback(err, results);
    });
}

function updateUserPassword(email, newPassword, callback) {
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    connection.query(query, [newPassword, email], (err, results) => {
        callback(err, results);
    });
}

module.exports = {
    connectToDatabase,
    findUserByEmail,
    registerUser,
    updateUserName,
    updateUserPassword,
    connection
};
