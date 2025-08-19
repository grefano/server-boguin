const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const { deleteVideo } = require('../database/queries')

router.delete('/delete/:id', async (req, res) => {
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