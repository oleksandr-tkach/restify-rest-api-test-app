'use strict';

const _ = require('lodash');
const ObjectID = require('mongoose').Types.ObjectId;
const errors = require('restify-errors');
const Router = require('restify-router').Router;

const Models = require('../models/index');

class CommentCtrl {
    constructor() {
        this.model = Models.Comment;
        this.router = new Router();

        this.router.get('/', this.getByMovie());
        this.router.post('/', this.create());
    }

    getByMovie() {
        return (req, res, next) => {
            let query = {};
            if (req.params.movie_id) {
                try {
                    query.movie_id = new ObjectID(req.params.movie_id);
                } catch (err) {
                    log.error(err);
                    return next(new errors.InvalidContentError(err.message));
                }
            }
            return this.model.find(query)
                .then((docs) => {
                    res.send(docs);
                    next();
                })
                .catch((err) => {
                    log.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                });
        };
    }

    create() {
        return (req, res, next) => {
            const data = req.body || {};
            const doc = new this.model(data);
            return Models.Movie.findById(doc.movie_id)
                .then((movie) => {
                    if (!movie) {
                        throw new Error('Movie with provided ID wasn\'t found.');
                    }
                    return doc.save();
                })
                .then((response) => {
                    res.send(response);
                    next();
                })
                .catch((err) => {
                    log.error(err);
                    return next(new errors.InternalError(err.message));
                });
        };
    }

}

module.exports = CommentCtrl;