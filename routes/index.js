'use strict';

/**
 * Module Dependencies
 */
const UserRoutes = require('./user');

class Routes {
    constructor () {
        let user = new UserRoutes();
        user.router.applyRoutes(server, '/user');
    }
}

module.exports = new Routes();