/**
 * Model schema of object "User"
 * A "User" is an admin of the site that is allowed to post
 * information and perform site operations
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')


// Mongo DB schema
const userMongoSchema = new mongoose.Schema({
	username: String,
	password: String
})
// generate JWT token for user
userMongoSchema.methods.generateAuthToken = function() {
	return jwt.sign({
		id: this.id,
		username: this.username
	}, process.env.JWT_PRIVATE_KEY, {
		expiresIn: process.env.JWT_EXPIRE_MINUTES * 60	// token expires in N seconds
	})
}
// register model in mongoose
const User =  mongoose.model('User', userMongoSchema)

// schema for Joi validation
const userValidateSchema = Joi.object({
	username: Joi.string()
		.alphanum()
		.min(3)
		.max(255)
		.required(),
	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
		.required()
})
// schema validation function
function validateUser(user) {
	return userValidateSchema.validate(user)
}

// exports
exports.User = User
exports.validate = validateUser
