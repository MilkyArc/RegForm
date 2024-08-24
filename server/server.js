const http = require('http');
const url = require('url');
const { connectToDatabase } = require('./db');
const { handleRequest } = require('./routes');
r
connectToDatabase((err) => {
  if (err) {
    console.error('Failed to connect to the database. Exiting.');
    process.exit(1);
  }


  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    handleRequest(req, res, parsedUrl.pathname);
  });

  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});
