require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000
const cors = require('cors')

const multer = require('multer')
const cloudinary = require('cloudinary').v2


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/videos', (req, res) => {
    console.log('Fetching videos')
    res.json([
        { id: 1, title: 'meu video do servidor', desc: 'descrição legal', file: '', thumbnail: 'thumbnail720.png'}
    ])
})

console.log(process.env.CLOUD_NAME)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const upload = multer({ storage: multer.memoryStorage()})

app.post('/api/upload-videos', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    if (!req.files || !req.files.video || !req.files.thumbnail) {
        return res.status(400).json({error: 'Video and thumbnail files are required'})
    }
    const videoFile = req.files.video[0]
    const thumbFile = req.files.thumbnail[0]
    const { title, desc, userId } = req.body
    
    let videoUrl, thumbUrl;

    try {
        const thumbResult = await cloudinary.uploader.upload(
            `data:${thumbFile.mimetype};base64,${thumbFile.buffer.toString('base64')}`,
            { resource_type: 'image', folder: 'thumbnails' }
        )
        thumbUrl = thumbResult.secure_url;
        console.log('Thumbnail uploaded:', thumbUrl)


        const videoResult = await cloudinary.uploader.upload(
            `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`,
            { resource_type: 'video', folder: 'videos' }
        )
        videoUrl = videoResult.secure_url;
        console.log('Video uploaded:', videoUrl)

        /*
        const connection = await db.getConnection();
        await connection.execute(
            'INSERT INTO videos (title, desc, video_url, thumb_url, user_id) VALUES ? ? ? ? ?',
            [title, desc, videoUrl, thumbUrl, userId]
        )

        res.status(201).json({
            message: 'Video published',
            videoUrl,
            thumbUrl
        })
            */

    } catch (error) {
        console.error('Error uploading files:', error)
        res.status(500).json({ error: 'Failed to upload publish video', error: error.message})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})