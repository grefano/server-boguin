require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')

const uploadRoute = require('./routes/upload')
const feedRoute = require('./routes/feed')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', uploadRoute)
app.use('/api', feedRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
    // const upload = multer({ storage: multer.memoryStorage()})
    
    // app.post('/api/upload-videos', upload.fields([
    //     { name: 'video', maxCount: 1 },
    //     { name: 'thumbnail', maxCount: 1 }
    // ]), async (req, res) => {
    //     if (!req.files || !req.files.video || !req.files.thumbnail) {
    //         return res.status(400).json({error: 'Video and thumbnail files are required'})
    //     }
    //     const videoFile = req.files.video[0]
    //     const thumbFile = req.files.thumbnail[0]
    //     const { title, desc, userId } = req.body
        
    //     let videoUrl, thumbUrl;
    
    //     try {
    //         const thumbResult = await cloudinary.uploader.upload(
    //             `data:${thumbFile.mimetype};base64,${thumbFile.buffer.toString('base64')}`,
    //             { resource_type: 'image', folder: 'thumbnails' }
    //         )
    //         thumbUrl = thumbResult.secure_url;
    //         console.log('Thumbnail uploaded:', thumbUrl)
    
    
    //         const videoResult = await cloudinary.uploader.upload(
    //             `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`,
    //             { resource_type: 'video', folder: 'videos' }
    //         )
    //         videoUrl = videoResult.secure_url;
    //         console.log('Video uploaded:', videoUrl)
    
            
    //         const connection = await db.getConnection();
    //         await connection.execute(
    //             'INSERT INTO videos (title, desc, video_url, thumb_url, user_id) VALUES ? ? ? ? ?',
    //             [title, desc, videoUrl, thumbUrl, userId]
    //         )
    
    //     } catch (error) {
    //         console.error('Error uploading files:', error)
    //         res.status(500).json({ error: 'Failed to upload publish video', error: error.message})
    //     }
    // })