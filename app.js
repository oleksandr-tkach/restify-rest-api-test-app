'use strict';

/**
 * Module Dependencies
 */
const config = require('./config/index');
const restify = require('restify');
const bunyan = require('bunyan');
const winston = require('winston');
const bunyanWinston = require('bunyan-winston-adapter');
const mongoose = require('mongoose');

/**
 * Logging
 */
global.log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            silent: config.debugger.silent,
            level: 'info',
            timestamp: () => {
                return new Date().toString()
            },
            json: true
        })
    ]
});

/**
 * Initialize Server
 */
global.server = restify.createServer({
    name: config.name,
    log: bunyanWinston.createAdapter(log)
});

/**
 * Middleware
 */
server.use(restify.jsonBodyParser({mapParams: true}));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser({mapParams: true}));
server.use(restify.fullResponse());

/**
 * Error Handling
 */
server.on('uncaughtException', (req, res, route, err) => {
    log.error(err.stack);
    res.send(err);
});

/**
 * Lift Server, Connect to DB & Bind Routes
 */
server.listen(config.port, () => {

    mongoose.connection.on('error', (err) => {
        log.error('Mongoose default connection error: ' + err);
        process.exit(1);
    });

    mongoose.connection.on('open', (err) => {

        if (err) {
            log.error('Mongoose default connection error: ' + err);
            process.exit(1);
        }

        log.info(
            '%s ready to accept connections on port %s in %s environment.',
            server.name,
            config.port,
            config.env
        );

        require('./routes/index');

    });

    global.db = mongoose.connect(config.db.uri);

});

module.exports = server;