'use strict';

/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const validate = require('mongoose-validate');
const mongooseApiQuery = require('mongoose-api-query');
const createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

var UserSchema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    surname: { type: String, trim: true },
    username: { type: String, trim: true, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, validate: [validate.email, 'invalid email address'] },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    active: { type: Boolean, default: false }
}, { minimize: false });

UserSchema.plugin(mongooseApiQuery);
UserSchema.plugin(createdModified, { index: true });

module.exports = UserSchema;