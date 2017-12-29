'use strict';

const mongoose = require('mongoose');
const createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

var CommentSchema = new mongoose.Schema({
    message: {type: String, trim: true, required: true},
    movie_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true}
}, {minimize: false});

CommentSchema.plugin(createdModified, {index: true});

module.exports = CommentSchema;