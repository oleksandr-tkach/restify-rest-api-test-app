'use strict';

const _ = require('lodash');

var common = {
    name: 'restify-starter',
    env: process.env.NODE_ENV || 'local',
    ip: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    baseUrl: 'http://' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 3000),
};

var envConfig = require('./' + common.env) || {};

module.exports = _.merge(common, envConfig);