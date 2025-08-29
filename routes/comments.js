const express = require('express')
const router = express.Router()
const { addComment, getComments, getCommentsByVideo, getCommentById, deleteCommentById, deleteCommentByUserAndVideo } = require('../database/queries/queries_comments')
const { authenticateToken } = require('../middlewares/authenticateToken')
const { PostgrestError } = require('@supabase/supabase-js')

router.get('/:id_video', express.json(), async (req, res) => {
    const { id_video } = req.params
    const comments = await getCommentsByVideo(id_video)
    console.log(comments)
    
    if (comments instanceof PostgrestError){
        res.status(500).json({error: comments})
    } else {
        res.status(200).json(comments)

    }
})

router.post('/', authenticateToken, express.json(), async (req, res) => {
    const { id_video, text } = req.body
    console.log(req.body)
    console.log(req.user)

    const error = await addComment(req.user, id_video, text)
    if (!!error){
        console.log(error)
        res.status(500).json({error: error})
    } else {
        console.log(data)
        res.status(200).json({ msg: data} )
        
    }
})


module.exports = router