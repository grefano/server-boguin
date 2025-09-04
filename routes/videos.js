const express = require('express')
const router = express.Router()
const { getChannelVideos, getVideos, getVideo, deleteVideo, addVideo, getVideosSubscriptions } = require('../database/queries/queries_videos')
const limit_size = 200 // mb
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { authenticateToken } = require('../middlewares/authenticateToken')
const { PostgrestError } = require('@supabase/supabase-js')

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
]), authenticateToken,  async(req, res) => {
    console.log('upload video')
    console.log(req.body)
    console.log(req.files)

    if (!req.files || !req.files.video || !req.files.thumbnail) {
        return res.status(400).json({error: 'Video and thumbnail files are required'})
    }
    const videoFile = req.files.video[0]
    const thumbFile = req.files.thumbnail[0]
    const { title, desc } = req.body

    let videoUrl, thumbUrl
    
    console.log('wow')
    // upload thumbnail file
    const thumbResult = await cloudinary.uploader.upload(
        `data:${thumbFile.mimetype};base64,${thumbFile.buffer.toString('base64')}`,
        { resource_type: 'image', folder: 'thumbnails' },
        function(error, result){
            if (error){
                console.log('error uploading thumbnail', error)
                return res.status(500).json({message: 'erro upload thumbnail'})

            } else {
                console.log('thumbnail uploaded', result)
            }
        }
    )
    
    thumbUrl = thumbResult.secure_url;
    console.log('Thumbnail uploaded:', thumbUrl)
    
    let thumb_name = thumbResult.public_id.split('/')
    thumb_name = thumb_name[thumb_name.length-1] 

    // upload video file
    const videoResult = await cloudinary.uploader.upload_large(
        `data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`,
        { resource_type: 'video', folder: 'videos' },
        async function(error, result) {
            if (error) {
                console.log('cloudinary error')
                console.log(result, error)

                cloudinary.uploader.destroy(thumbResult.public_id, function(error, result){
                    if (error){
                        console.log('error deleting thumbnail', error)
                    } else {
                        console.log('thumbnail deleted', result)
                    }
                })
                return res.status(500).json({message: 'erro upload video'})
            }
        }
    )
    
    videoUrl = videoResult.secure_url;
    console.log('Video uploaded:', videoUrl)

    // query database
    console.log('query database')
    let video_name = videoResult.public_id.split('/')
    video_name = video_name[video_name.length-1] 
    const newVideo = await addVideo(video_name, thumb_name, req.user, title)
    if (newVideo instanceof PostgrestError){
        console.log('error querying video', newVideo)
        cloudinary.uploader.destroy(thumbResult.public_id)
        cloudinary.uploader.destroy(videoResult.public_id)
        res.status(500).json({message: `error querying video ${newVideo}`})
    } else {
        res.status(201).json({ message: 'video enviado com sucesso', video: newVideo})
    }

   
})


router.get('/feed/recent', async (req, res) => {
    const {page} = req.query
    try {
        const videos = await getVideos(page)
        res.status(200).json(videos)
    } catch (error){
        console.error('erro ao buscar videos do feed de videos recentes', error)
        res.status(500).json({ error: 'erro ao buscar vídeos'})
    }
})

router.get('/feed/subscriptions', authenticateToken, async (req, res) => {
    console.log('feed subs')
    const {page} = req.query
    try {
        const videos = await getVideosSubscriptions(req.user, page)
        res.status(200).json(videos)
    } catch (error){
        console.error('erro ao buscar videos do feed de inscrições', error)
        res.status(500).json({ error: 'erro ao buscar vídeos'})
    }        
})        

const {getFriendRowsByUser} = require('../database/queries/queries_friends')
const supabase = require('../db')
const {differenceInMinutes} = require('date-fns')

router.get('/feed', async (req, res) => {
    console.log('feed')
    const {page} = req.query
    const user = 'grefano'
    try {
        // const videos = await getVideos(page)
        const resultFriends = await getFriendRowsByUser(user, {})
        console.log(`friends ${JSON.stringify(resultFriends)}`)
        const friendsIds = resultFriends.map(friend => {
            return friend.id_receiver == user ? friend.id_sender : friend.id_receiver
        })
        console.log(`\nfriends ids`, friendsIds)
        const {data: excludedVideos} = await supabase.from('watchtime').select('id_video').eq('id_user', user)
        const excludeIdVideos = excludedVideos?.map(item => item.id_video) || []
        const {data: watchedVideosData, error: watchedVideosError} = await supabase.from('watchtime').select('id_user, time, created_at, video(*)').in('id_user', friendsIds).not('video.id', 'in', `(${excludeIdVideos.join(',')})`)
        console.log(`\nvideos watched ${JSON.stringify(watchedVideosData)} error ${JSON.stringify(watchedVideosError)}`)

        const videos = watchedVideosData.reduce((accumulator, current) => {
            if (current.video == null) return accumulator;
            console.log('atual', JSON.stringify(current))
            const watched_by = current.id_user
            const watched_time = current.time
            const watched_date = current.created_at
            const time_since_watched = differenceInMinutes(new Date(), new Date(watched_date))
            const time_since_posted = differenceInMinutes(new Date(), new Date(current.video.created_at))
            const score = watched_time*watched_time*100000/time_since_posted/time_since_watched
            accumulator.push({...current.video, time_since_posted, watched_by, watched_time, time_since_watched, score})
            return accumulator
        }, [])
        
        console.log('\nfriends watched', JSON.stringify(videos))

        res.status(200).json(videos)
    } catch (error){
        console.error('erro ao buscar videos do feed', error)
        res.status(500).json({ error: 'erro ao buscar vídeos'})
    }        
})        

router.get('/:id', async (req, res) => {
    // console.log('get video')
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
    // console.log('my-videos')
    try{
        const { userId } = req.params
        const { page } = req.query
        const videos = await getChannelVideos(userId, page)
        res.status(200).json(videos)
    } catch (error){
        console.error('erro ao buscar vídeos', error)
        res.status(500).json({error:'erro ao buscar vídeos'})
    }    
})        



router.delete('/:id', authenticateToken, async (req, res) => {
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