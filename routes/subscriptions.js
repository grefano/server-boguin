const express = require('express')
const router = express.Router()

const { getSubscription, addSubscription, removeSubscription } = require('../database/queries/queries_subscriptions')
const { PostgrestError } = require('@supabase/supabase-js')
const { authenticateToken } = require('../middlewares/authenticateToken')

router.get('/', async (req, res) => {
    const {owner_id, subject_id, type} = req.query
    if (!owner_id || !subject_id){
        res.status(500).json({msg:'algum dos usuários não foi especificado'})
    }
    const result = await getSubscription(owner_id, subject_id, type)

    if (result[0] == undefined){
        res.status(200).json({subscribed: false})
    } else {
        res.status(200).json({subscribed: true})
    }
    
})

router.delete('/', async (req, res) => {
    console.log('delete')
    console.log(req.query)
    const {owner_id, subject_id, type} = req.query
    if (!owner_id || !subject_id){
        res.status(500).json({msg:'algum dos usuários não foi especificado'})
    }
    const result = await removeSubscription(owner_id, subject_id, type)
    console.log(`delete subscription ${owner_id} ${subject_id} ${type} result ${result}`)
    console.log(JSON.stringify(result))
    if (result instanceof PostgrestError){
        res.status(200).json({subscribed: true})
    } else {
        res.status(200).json({subscribed: false})
    }
})

router.post('/', authenticateToken, async (req, res) => {
    const {owner_id, subject_id, type} = req.query
    console.log(`add sub`)
    console.log(req.query)
    console.log(`${owner_id} ${subject_id} ${type}`)
    const result = await addSubscription(owner_id, subject_id, type)
    console.log(`result ${JSON.stringify(result)}`)
    
    if (result instanceof PostgrestError){
        res.status(200).json({subscribed: false})
    } else {
        res.status(200).json({subscribed: true})
    }
})



module.exports = router