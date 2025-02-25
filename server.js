const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const host = 'localhost';
const port = 3000;

const requestListener = async function (req, res) {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const contentType = getContentType(filePath);

    try {
        const content = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (err) {
        res.writeHead(404);
        res.end('File not found');
    }
};

function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'text/javascript';
        case '.css':
            return 'text/css';
        default:
            return 'text/plain';
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
