const http = require('http');
const url = require('url');
const { connectToDatabase } = require('./db');
const { handleRequest } = require('./routes');

const RATE_LIMIT_WINDOW_MS = 1 * 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 200; // Maximum number of requests per window per IP
const requestCounts = {}; 


function rateLimit(req, res) {
    const ip = req.connection.remoteAddress;
    const currentTime = Date.now();

    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 1, startTime: currentTime };
    } else {
        const elapsedTime = currentTime - requestCounts[ip].startTime;

        if (elapsedTime < RATE_LIMIT_WINDOW_MS) {
            requestCounts[ip].count++;

            if (requestCounts[ip].count > MAX_REQUESTS_PER_WINDOW) {
                res.writeHead(429, { 'Content-Type': 'text/plain' });
                res.end('Too Many Requests');
                return false;
            }
        } else {
            requestCounts[ip] = { count: 1, startTime: currentTime };
        }
    }

    return true;
}

if (require.main === module)
{

connectToDatabase((err) => {
    if (err) {
        console.error('Failed to connect to the database. Exiting.');
        process.exit(1);
    }

        const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);

        if (!rateLimit(req, res)) {
            return; 
        }

        handleRequest(req, res, parsedUrl.pathname);
    });

    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});


setInterval(() => {
    for (const ip in requestCounts) {
        if (Date.now() - requestCounts[ip].startTime > RATE_LIMIT_WINDOW_MS) {
            delete requestCounts[ip];
        }
    }
}, RATE_LIMIT_WINDOW_MS);

}

module.exports = {rateLimit, MAX_REQUESTS_PER_WINDOW, requestCounts};