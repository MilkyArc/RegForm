require('dotenv').config({ path: '../env/.env' });

const mysql = require('mysql');


const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function connectToDatabase(callback) {
    dbConnection.connect(err => {
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
    dbConnection.query(query, [email], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results[0]);
    });
}

function registerUser(userData, callback) {
    const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    const values = [userData.firstName, userData.lastName, userData.email, userData.password];
    dbConnection.query(query, values, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.insertId);
    });
}

function updateUserName(email, firstName, lastName, callback) {
    const query = 'UPDATE users SET firstName = ?, lastName = ? WHERE email = ?';
    dbConnection.query(query, [firstName, lastName, email], (err, results) => {
        callback(err, results);
    });
}

function updateUserPassword(email, newPassword, callback) {
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    dbConnection.query(query, [newPassword, email], (err, results) => {
        callback(err, results);
    });
}

module.exports = {
    connectToDatabase,
    findUserByEmail,
    registerUser,
    updateUserName,
    updateUserPassword,
    dbConnection,
};
