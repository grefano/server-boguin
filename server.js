require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')



const videosRoute = require('./routes/videos')
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const cronRoute = require('./routes/cron')
const subscriptionsRoute = require('./routes/subscriptions')
const commentsRoute = require('./routes/comments')

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [ 'https://boguin.vercel.app', 'https://optionally-allowed-polliwog.ngrok-free.app']
        if (!origin){
            return callback(null, true)
        }
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            return allowedOrigin == origin
        })
        if (isAllowed){
            callback(null, true)
        } else {
            console.log(`cors bloqueou origin ${origin}`)
            callback(new Error(`origem ${origin} não permitida pelo cors`))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}))

app.use('/api/videos', videosRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/subscriptions', subscriptionsRoute)
app.use('/api/comments', commentsRoute)
app.use('/keep-alive', cronRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})