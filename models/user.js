/**
 * Model schema of object "User"
 * A "User" is an admin of the site that is allowed to post
 * information and perform site operations
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

const mongoose = require('mongoose')
const Joi = require('joi')


// Mongo DB schema
const userMongoSchema = new mongoose.Schema({
	username: String,
	password: String
})
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

// userSchema.methods.generateAuthToken = function() {
// 	return jwt.sign({_id: this.id}, config.jwtPrivateKey)
// }


function validateUser(user) {
	return userValidateSchema.validate(user)
}

// exports
exports.User = User
exports.validate = validateUser
