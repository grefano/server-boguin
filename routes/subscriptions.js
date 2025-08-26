const express = require('express')
const router = express.Router()

const { addSubscription, removeSubscription } = require('../database/queries/queries_subscriptions')

router.post('/', async (req, res) => {
    const {owner_id, subject_id, type} = req.query
    console.log(`add sub`)
    console.log(req.query)
    console.log(`${owner_id} ${subject_id} ${type}`)
    const result = await addSubscription(owner_id, subject_id, type)
    console.log(result)
    res.status(200)
})

module.exports = router