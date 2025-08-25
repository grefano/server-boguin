const express = require('express')
const router = express.Router()
const { getChannelVideos, getVideos, getVideo, deleteVideo, addVideo } = require('../database/queries/queries_videos')
const limit_size = 200 // mb
const multer = require('multer')
const cloudinary = require('cloudinary').v2

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: limit_size * 1024 * 1024 } // 100 MB limit
})    


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})    

router.post('/', upload.fields([
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
        const videoResult = await cloudinary.uploader.upload_large(
            `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`,
            { resource_type: 'video', folder: 'videos' },
            function(error, result) {
                if (error) {
                    console.log('cloudinary error')
                    console.log(result, error)
                }
            }
        )
        videoUrl = videoResult.secure_url;
        console.log('Video uploaded:', videoUrl)
    
        // query database
        let video_name = videoResult.public_id.split('/')
        video_name = video_name[video_name.length-1] 
        const newVideo = await addVideo(video_name, thumb_name, userId, title)
        res.status(201).json({ message: 'video enviado com sucesso', video: newVideo})
    
    } catch (error) {
        if (error.http_code == 413) {
            res.status(413).json({error: `arquivo muito grande. Tamanho máximo: ${limit_size}MB`})

        } else {
            res.status(500).json({error: 'erro ao processar upload do vídeo'})

        }
        console.error('erro no upload do video: ', error)
    }
})



router.get('/feed', async (req, res) => {
    console.log('feed')
    try {
        const videos = await getVideos()
        res.status(200).json(videos)
    } catch (error){
        console.error('erro ao buscar videos do feed', error)
        res.status(500).json({ error: 'erro ao buscar vídeos'})
    }        
})        

router.get('/:id', async (req, res) => {
    console.log('get video')
    const { id } = req.params
    try {
        const video = await getVideo(id)
        res.status(200).json(video)
    } catch (error) {
        console.error(`erro ao buscar video ${id}`, error)
        res.status(500).json({ error: 'erro ao buscar vídeos'})
    }    
})    


router.get('/users/:userId', async (req, res) => {
    console.log('my-videos')
    try{
        console.log(req.params)
        const { userId } = req.params
        const videos = await getChannelVideos(userId)
        res.status(200).json(videos)
    } catch (error){
        console.error('erro ao buscar vídeos', error)
        res.status(500).json({error:'erro ao buscar vídeos'})
    }    
})        



router.delete('/:id', async (req, res) => {
    try {
        console.log('delete')
        const { id } = req.params
        const video = await getVideo(id)
        if (!video) {
            return res.status(404).json({ error: 'Video not found' })
        }        
        await cloudinary.uploader.destroy(id, { resource_type: 'video', invalidate: true }, function(error, result) {
            if (error) {
                return res.status(500).json({ error: 'Error deleting video from Cloudinary' })
            }        
        })        
        await cloudinary.uploader.destroy(video.id_thumb, { resource_type: 'image', invalidate: true }, function(error, result) {
            if (error) {
                return res.status(500).json({ error: 'Error deleting thumbnail from Cloudinary' })
            }        
        })        
        
        await deleteVideo(id)

        res.status(200).json({ message: 'Video and thumbnail deleted successfully' })
    } catch (error) {
        console.error('Error deleting video:', error)
        res.status(500).json({ error: 'erro no server ao excluir video' })
    }        
})        




module.exports = router