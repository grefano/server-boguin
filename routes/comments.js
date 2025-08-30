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
    console.log('body', req.body)
    console.log('user', req.user)

    const result = await addComment(req.user, id_video, text)
    if (result instanceof PostgrestError){
        console.log('error', result)
        res.status(500).json({error: result})
    } else {
        console.log('data', result)
        res.status(200).json({ msg: result} )
        
    }
})


module.exports = router