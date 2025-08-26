const express = require('express')
const router = express.Router()


router.get('/keep-alive', async(req, res) => {
    res.status(200).json({msg: 'recebido'})
})

module.exports = router