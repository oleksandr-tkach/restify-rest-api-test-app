'use strict';

/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = {
    Movie: mongoose.model('Movie', require('./movie'), 'movie'),
    Comment: mongoose.model('Comment', require('./comment'), 'comment')
};