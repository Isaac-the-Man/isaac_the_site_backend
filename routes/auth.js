/**
 * Route for authentication related operations
 * base route is /api/auth
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

const express = require('express')
const router = express.Router()
const {User, validateUser} = require('../models/user')
const {Token, validateToken} = require('../models/token')
const bcrypt = require('bcrypt')
const randtoken = require('rand-token')
const auth = require('../middleware/auth')


// verify auth token (auth)
router.post('/verify', auth, async (req, res) => {
    res.send('verified.')
})

// get auth tokens with username and password
router.post('/', async (req, res) => {
    // input validation
    const {error} = validateUser(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // query user
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

    // generate access token
    const access_token = user.generateAuthToken()

    // generate refresh token
    const refresh_token = randtoken.uid(256)

    // store refresh token in database
    const now = new Date()
    now.setSeconds(now.getSeconds() + 60 * 60)    // refresh token expires in 1 hr
    const old_token = await Token.findOneAndUpdate({
        uid: user._id
    }, {
        token: refresh_token,
        exp: now
    })
    if (old_token === null) {
        // no previous refresh token found, create new entry
        const new_token = new Token({
            uid: user._id,
            token: refresh_token,
            exp: now
        })
        try {
            // save to database
            await new_token.save()
        } catch (e) {
            console.error('Error while saving refresh token to database.')
            console.error(e)
            return res.status(500).send('Error while generating auth token.')
        }
    }

    // send auth tokens
    return res.json({
        'access_token': access_token,
        'refresh_token': refresh_token
    })
})

// renew auth tokens with old refresh token (auth)
router.post('/renew', async (req, res) => {
    // input validation
    const {error} = validateToken(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // generate new refresh token
    const refresh_token = randtoken.uid(256)

    // verify refresh token and update
    const now = new Date()
    now.setSeconds(now.getSeconds() + 60 * 60)    // refresh token expires in 1 hr
    const old_token = await Token.findOneAndUpdate({
        uid: req.body.uid,
        token: req.body.token
    }, {
        token: refresh_token,
        exp: now
    })
    if (old_token == null) {
        // no matching record for this refresh token
        return res.status(403).send('Unauthorized.')
    }

    // query user
    let user;
    try {
        user = await User.findById(req.body.uid)
    } catch(e) {
        console.error('Error while querying user from database.')
        console.error(e)
        return res.status(500).send('Error while generating auth token.')
    }

    // generate new auth token
    const access_token = user.generateAuthToken()

    // send renewed auth tokens
    return res.json({
        'access_token': access_token,
        'refresh_token': refresh_token
    })
})

// exports
module.exports = router
