const express = require('express')
const router = express.Router()

const cloudinary = require('cloudinary').v2
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage()})

const { addVideo } = require('../database/queries')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


router.post('/upload-videos', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async(req, res) => {
    try {
        if (!req.files || !req.files.video || !req.files.thumbnail) {
            return res.status(400).json({error: 'Video and thumbnail files are required'})
        }
        const videoFile = req.files.video[0]
        const thumbFile = req.files.thumbnail[0]
        const { title, desc, userId } = req.body

        let videoUrl, thumbUrl
        
        // upload thumbnail file
        const thumbResult = await cloudinary.uploader.upload(
            `data:${thumbFile.mimetype};base64,${thumbFile.buffer.toString('base64')}`,
            { resource_type: 'image', folder: 'thumbnails' }
        )
        thumbUrl = thumbResult.secure_url;
        console.log('Thumbnail uploaded:', thumbUrl)
        
        let thumb_name = thumbResult.public_id.split('/')
        thumb_name = thumb_name[thumb_name.length-1] 

        // upload video file
        const videoResult = await cloudinary.uploader.upload(
            `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`,
            { resource_type: 'video', folder: 'videos' }
        )
        videoUrl = videoResult.secure_url;
        console.log('Video uploaded:', videoUrl)
        
        // query database
        let video_name = videoResult.public_id.split('/')
        video_name = video_name[video_name.length-1] 
        const newVideo = await addVideo(video_name, thumb_name, userId, title)
        res.status(201).json({ message: 'video enviado com sucesso', video: newVideo})
    
    } catch (error) {
        console.error('erro no upload do video: ', error)
        res.status(500).json({error: 'erro ao processar upload do vídeo'})
    }
})

module.exports = router