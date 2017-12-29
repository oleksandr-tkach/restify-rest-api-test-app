'use strict';

const MovieRoutes = require('./movie');
const CommentRoutes = require('./comment');

class Routes {
    constructor() {
        const movies = new MovieRoutes();
        const comments = new CommentRoutes();

        movies.router.applyRoutes(server, '/movies');
        comments.router.applyRoutes(server, '/comments');
    }
}

module.exports = new Routes();