require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')



const videosRoute = require('./routes/videos')
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}))

app.use('/api/videos', videosRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})