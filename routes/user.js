'use strict';

/**
 * Base Controller
 */
const Base = require('./base');

class UserCtrl extends Base{
    constructor() {
        super('User');
    }
}

module.exports = UserCtrl;