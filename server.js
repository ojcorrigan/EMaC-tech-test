const server = require('express')();
const apiRouter = require('./routes/api');
const invalidPath = require('./controllers/invalid.path');

server.use('/api', apiRouter);

server.all('*', invalidPath);

module.exports = server;
