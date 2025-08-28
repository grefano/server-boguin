const express = require('express')
const router = express.Router()

const { getUser, addAccount } = require('../database/queries/queries_users')


router.get('/:userId', async (req, res) => {
    const { userId } = req.params
    // console.log(`get user ${userId}`)
    try{
        const user = await getUser(userId)
        if (user == undefined){
            res.status(404).json({msg: 'usuário não encontrado'})
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router