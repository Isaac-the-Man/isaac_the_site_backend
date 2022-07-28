/**
 * Middleware for authorizing user
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

require('dotenv').config()
const jwt = require('jsonwebtoken')


// authorize API route
function auth(req, res, next) {
    // get auth token from header
    const token = req.header('X-auth-token')

    if (!token) {
        // no token found
        return res.status(401).send('X-auth-token missing in header.')
    }

    // verify token
    try {
        req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        next()
    } catch(e) {
        // invalid token
        return res.status(403).send('Token expired or unauthorized.')
    }
}

module.exports = auth