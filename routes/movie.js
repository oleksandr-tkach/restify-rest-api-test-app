'use strict';

const _ = require('lodash');
const errors = require('restify-errors');
const Router = require('restify-router').Router;

const OmdbApi = require('../omdbapi');

const Models = require('../models/index');

class MovieCtrl {
    constructor() {
        this.model = Models.Movie;
        this.router = new Router();

        this.router.get('/', this.all());
        this.router.post('/', this.create());
    }

    all() {
        return (req, res, next) => {
            // page
            // per_page
            // sort_by (field,desc/asc)
            let page = req.params.page ? parseInt(req.params.page) : 1,
                per_page = req.params.per_page ? parseInt(req.params.per_page) : 10,
                sort = false;

            if (req.params.sort_by) {
                const parts = req.params.sort_by.split(',');
                sort = {};
                sort[parts[0]] = parts.length > 1 ? parts[1] : 1;
            }

            let query = this.model.find({}).limit(per_page).skip((page - 1) * per_page);
            if (sort) {
                query = query.sort(sort);
            }

            return query.exec()
                .then((docs) => {
                    res.send(docs);
                    next();
                })
                .catch((err) => {
                    log.error(err);
                    return next(new errors.BadRequestError(err.errors.name.message));
                });
        };
    }

    create() {
        return (req, res, next) => {
            let doc;
            const data = req.body || {};
            if (_.isEmpty(data) || !data.title) {
                const noTitleError = new Error('No title provided');
                log.error(noTitleError);
                return next(new errors.BadRequestError(noTitleError.message));
            }
            const omdbApi = new OmdbApi();
            return omdbApi.getByTitle(data.title)
                .then((movie) => {
                    doc = new this.model(movie);
                    return this.model.findOne({Title: doc.Title});
                })
                .then((obj) => {
                    if (obj) {
                        throw new Error(`Movie by title ${doc.Title} already exists!`);
                    }
                    return doc.save();
                })
                .then((result) => {
                    res.send(result);
                    next();
                })
                .catch((err) => {
                    log.error(err);
                    return next(new errors.BadRequestError(err.message));
                });
        };
    }
}

module.exports = MovieCtrl;