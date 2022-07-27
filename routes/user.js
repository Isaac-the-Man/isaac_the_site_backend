/**
 * Route for user related operations
 * base route is /api/user
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

const express = require('express')
const router = express.Router()
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')


// create new user (auth)
router.post('/', auth, async (req, res) => {
    // input validation
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // create new user
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    // hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    // save to database
    try {
        await user.save();
    } catch (e) {
        // error occured
        console.error('Error saving user to database.')
        console.error(e)
        return res.status(500).send('Error occured while creating user.')
    }

    // generate and return auth token
    const token = user.generateAuthToken()

    return res.send(token)
})

// exports
module.exports = router
