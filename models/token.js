/**
 * Model schema of object "Token"
 * A "Token" is the refreshment token with its
 * associated user id
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

const mongoose = require('mongoose')
const Joi = require('joi')


// Mongo DB schema
const tokenMongoSchema = new mongoose.Schema({
	uid: String,
	token: String,
    exp: Date
})

// register model in mongoose
const Token =  mongoose.model('Token', tokenMongoSchema)

// schema for Joi validation
const tokenValidateSchema = Joi.object({
    uid: Joi.string()
        .required(),
    token: Joi.string()
        .required(),
})
// schema validation function
function validateToken(token) {
    return tokenValidateSchema.validate(token)
}

// exports
exports.Token = Token
exports.validateToken = validateToken
