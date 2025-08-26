const express = require('express')
const router = express.Router()


router.get('/', async(req, res) => {
    console.log('pong')
    res.status(200).json({msg: 'pong'})
})

module.exports = router