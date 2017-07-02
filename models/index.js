'use strict';

/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = {
    User: mongoose.model('User', require('./user'), 'user')
};