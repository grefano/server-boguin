const express = require('express')
const router = express.Router()

const { getSubscription, addSubscription, removeSubscription } = require('../database/queries/queries_subscriptions')
const { PostgrestError } = require('@supabase/supabase-js')

router.get('/', async (req, res) => {
    const {owner_id, subject_id, type} = req.query
    if (!owner_id || !subject_id){
        res.status(500).json({msg:'algum dos usuários não foi especificado'})
    }
    console.log(`get sub`)
    console.log(req.query)
    const result = await getSubscription(owner_id, subject_id, type)
    console.log(`result ${result}`)
    console.log(`result ${result[0]}`)
    console.log(`result ${JSON.stringify(result)}`)
    console.log(`result ${JSON.stringify(result[0])}`)
    
    if (result instanceof PostgrestError || result == undefined){
        console.log('erro get sub')
        console.log(`${owner_id} NÃO é inscrito de ${subject_id}`)
        res.status(500).json(result)
    } else {
        console.log('get sub deu certo')
        console.log(`${owner_id} é inscrito de ${subject_id}`)
        res.status(200).json(result)
    }
    
})

router.post('/', async (req, res) => {
    const {owner_id, subject_id, type} = req.query
    console.log(`add sub`)
    console.log(req.query)
    console.log(`${owner_id} ${subject_id} ${type}`)
    const result = await addSubscription(owner_id, subject_id, type)
    console.log(result)
    
    if (result instanceof PostgrestError){
        res.status(500).json(result)
    } else {
        res.status(200).json(result)
    }
})



module.exports = router