'use strict';

const mongoose = require('mongoose');
const createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

// some custom validation can be added
var MovieSchema = new mongoose.Schema({
    Title: {type: String, trim: true, required: true, unique: true},
    Year: {type: String, trim: true, required: true},
    Rated: {type: String, trim: true},
    Released: {type: String, trim: true},
    Runtime: {type: String, trim: true},
    Genre: {type: String, trim: true},
    Director: {type: String, trim: true},
    Writer: {type: String, trim: true},
    Actors: {type: String, trim: true},
    Plot: {type: String, trim: true},
    Language: {type: String, trim: true},
    Country: {type: String, trim: true},
    Awards: {type: String, trim: true},
    Poster: {type: String, trim: true},
    Ratings: [{
        Source: {type: String, trim: true},
        Value: {type: String, trim: true}
    }],
    Metascore: {type: String, trim: true},
    imdbRating: {type: String, trim: true},
    imdbVotes: {type: String, trim: true},
    imdbID: {type: String, trim: true},
    Type: {type: String, trim: true},
    DVD: {type: String, trim: true},
    BoxOffice: {type: String, trim: true},
    Production: {type: String, trim: true},
    Website: {type: String, trim: true},
    Response: {type: String, trim: true}

}, {minimize: false});

MovieSchema.plugin(createdModified, {index: true});

module.exports = MovieSchema;