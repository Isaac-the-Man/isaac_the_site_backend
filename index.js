require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')


// check for critical env variables
const env_vars = ['DB_NAME', 'SERVER_PORT', 'SERVER_HOST']
env_vars.forEach((item) => {
	if (process.env[item] === undefined) {
		console.error(`Env variable "${item}" not defined.`)
		process.exit(1)
	}
})

// connect to MongoDB
mongoose.connect(`mongodb://db:27017/${process.env.DB_NAME}`).then(() => {
	console.log('Connected to database.')
}).catch((e) => {
	console.error('Error connecting to database.')
	console.error(e)
	process.exit(1);
});

// start express server
const app = express()

// default root hook
app.get('/api', (req, res) => {
	res.send('isaac_the_site api server.')
})

// start listening to requests
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
	console.log(`Running on http://${process.env.SERVER_PORT}:${process.env.SERVER_HOST}.`)
})