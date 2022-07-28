/**
 * Route for authentication related operations
 * base route is /api/auth
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

const express = require('express')
const router = express.Router()
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')


// verify auth token (auth)
router.post('/verify', auth, async (req, res) => {
    res.send('verified.')
})

// get auth token with username and password
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

// renew token with old auth token (auth)
router.post('/renew', auth, async (req, res) => {
    // query for user
    let user
    try {
        user = await User.findById(req.user.id)
    } catch(e) {
        console.error('Error while querying user from database.')
        console.error(e)
        return res.status(500).send('Error while generating auth token.')
    }


    // generate new auth token
    const token = user.generateAuthToken()

    return res.send(token)
})

// exports
module.exports = router
