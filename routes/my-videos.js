const express = require('express')
const router = express.Router()
const { getChannelVideos } = require('../database/queries')

router.get('/my-videos', async (req, res) => {
    console.log('my-videos')
    
})

module.exports = router