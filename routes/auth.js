/**
 * Route for authentication related operations
 * base route is /api/auth
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

const express = require('express')
const router = express.Router()
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt')


// authenticate user
router.post('/', async (req, res) => {
    // input validation
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // query for user
    let user;
    try {
        user = await User.findOne({
            username: req.body.username
        })
    } catch(e) {
        console.error('Error while querying user from database.')
        console.error(e)
        return res.status(500).send('Error while generating auth token.')
    }

    // validate password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordValid) {
        // invalid password
        return res.status(403).send('Invalid username or password.')
    }

    // generate and return auth token
    const token = user.generateAuthToken()

    return res.send(token)
})

// exports
module.exports = router
