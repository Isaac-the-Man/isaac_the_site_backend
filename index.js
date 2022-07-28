/**
 * Entry point of the program "isaac_the_site_backend"
 * Author: Yu-Kai "Isaac_the_Man" Wang
 */

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');


// check for critical env variables
const envVars = ['DB_NAME', 'SERVER_PORT', 'SERVER_HOST', 'JWT_PRIVATE_KEY', 'JWT_EXPIRE_MINUTES']
envVars.forEach((item) => {
	if (process.env[item] === undefined) {
		console.error(`Env variable "${item}" not defined.`)
		process.exit(1)
	}
})

// connect to MongoDB
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`).then(() => {
	console.log('Connected to database.')
}).catch((e) => {
	console.error('Error connecting to database.')
	console.error(e)
	process.exit(1);
});

// start express server
const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

// default root hook
app.get('/api', (req, res) => {
	return res.send('isaac_the_site api server.')
})

// attach routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

// start listening to requests
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
	console.log(`Running on http://${process.env.SERVER_PORT}:${process.env.SERVER_HOST}.`)
})
