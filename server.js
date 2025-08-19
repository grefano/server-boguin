require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')

   
const videosRoute = require('./routes/videos')
const authRoute = require('./routes/auth')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/videos', videosRoute)
app.use('/api/auth', authRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})