const httpServer = require('http-server');

const server = httpServer.createServer({
    root: '.',  // Serve current directory
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});