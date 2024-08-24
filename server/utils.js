const fs = require('fs');

function parseCookies(request) {
  return request.headers?.cookie?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
  }, {}) || {};
}


function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

module.exports = {
  parseCookies,
  serveStaticFile
};
