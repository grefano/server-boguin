require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')

const uploadRoute = require('./routes/upload')
const feedRoute = require('./routes/feed')
const authRoute = require('./routes/auth')
const deleteRoute = require('./routes/delete')
    
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api', uploadRoute)
app.use('/api', feedRoute)
app.use('/api', authRoute)
app.use('/api', deleteRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})