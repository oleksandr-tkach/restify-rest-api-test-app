'use strict';

/**
 * Module Dependencies
 */
const _ = require('lodash');
const errors = require('restify-errors');
const Router = require('restify-router').Router;
/**
 * Model Schema
 */
const Models = require('../models/index');

class Base {
    constructor(model) {
        this.model = Models[model];
        this.router = new Router();
        this.router.get('/', this.all());
        this.router.get('/:id', this.getById());
        this.router.post('/', this.create());
        this.router.put('/:id', this.update());
        this.router.del('/:id', this.delete());
    }

    all() {
        return (req, res, next) => {
            this.model.apiQuery(req.params, (err, docs) => {
                if (err) {
                    log.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                }
                res.send(docs);
                next();
            })
        };
    }

    getById() {
        return (req, res, next) => {
            this.model.findOne({ _id: req.params.id }, function(err, doc) {
                if (err) {
                    log.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                }
                res.send(doc);
                next();
            })
        };
    }

    create() {
        return (req, res, next) => {
            let data = req.body || {};
            let doc = new this.model(data);
            doc.save(function(err) {
                if (err) {
                    log.error(err);
                    return next(new errors.InternalError(err.message));
                    next();
                }
                res.send(201);
                next();
            })
        };
    }

    update() {
        return (req, res, next) => {
            let data = req.body || {};
            if (!data._id) {
                _.extend(data, {
                    _id: req.params.id
                });
            }
            this.model.findOne({ _id: req.params.id }, function(err, doc) {
                if (err) {
                    log.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                } else if (!doc) {
                    return next(new errors.ResourceNotFoundError('The resource you requested could not be found.'))
                }
                this.model.update({ _id: data._id }, data, function(err) {
                    if (err) {
                        log.error(err);
                        return next(new errors.InvalidContentError(err.errors.name.message));
                    }
                    res.send(200, data);
                    next();
                })
            })
        };
    }

    delete() {
        return (req, res, next) => {
            this.model.remove({ _id: req.params.id }, function(err) {
                if (err) {
                    log.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                }
                res.send(204);
                next()
            })
        };
    }
}

module.exports = Base;