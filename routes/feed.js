const express = require('express')
const router = express.Router()
const { getVideos } = require('../database/queries')

router.get('/feed', async (req, res) => {
    try {
        const videos = await getVideos()
        res.status(200).json({videos})
    } catch (error){
        console.error('erro ao buscar videos do feed', error)
        res.status(500).json({ error: 'erro ao buscar vídeos'})
    }
})

module.exports = router