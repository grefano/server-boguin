const express = require('express')
const { authenticateToken } = require('../middlewares/authenticateToken')
const router = express.Router()
const { addWatchTime, getWatchedVideos } = require('../database/queries/queries_data')
const { PostgrestError } = require('@supabase/supabase-js')
const { getFriendRowsByUsers } = require('../database/queries/queries_friends')

router.get('/watchtime/:id_user', authenticateToken, async (req, res) => {
    const {id_user} = req.params
    const {page} = req.query
    const friend = await getFriendRowsByUsers(id_user, req.user)
    if (friend instanceof PostgrestError){
        return res.status(500).json({error: friend})
    } else if (friend.length == 0 || friend[0].status != 'accepted'){
        // não são amigos
        return res.status(500).json({msg: 'usuários não são amigos'})
    } 

    console.log('get videos watched by', id_user)
    const result = await getWatchedVideos(id_user, page)
    if (result instanceof PostgrestError){
        res.status(500).json({error: result})
    } else {
        res.status(200).json(result)
    }
})

router.post('/watchtime/:id_video/:time', authenticateToken, async (req, res) => {
    const {id_video, time} = req.params
    console.log('add wach time', id_video, time)
    const result = await addWatchTime(req.user, id_video, time)
    console.log(result, JSON.stringify(result))
    if (result instanceof PostgrestError){
        res.status(500).json({error: result})
    } else {
        res.status(200).json({msg: 'watch time registrado'})
    }
})

module.exports = router