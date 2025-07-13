const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/api/videos', (req, res) => {
    console.log('Fetching videos')
    res.json([
        { id: 1, title: 'meu video do servidor'}
    ])
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})