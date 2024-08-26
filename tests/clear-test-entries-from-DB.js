const mysql = require('mysql');
require('dotenv').config({ path: '../env/.env' });


const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


dbConnection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');

    const deleteQuery = "DELETE FROM users WHERE email LIKE '%@unittest.com'";

    dbConnection.query(deleteQuery, (err, results) => {
        if (err) {
            console.error('Error deleting test entries:', err.stack);
        } else {
            console.log(`Deleted ${results.affectedRows} test entries.`);
        }

        dbConnection.end(err => {
            if (err) {
                console.error('Error closing the database connection:', err.stack);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
});
