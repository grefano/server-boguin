const express = require('express')
const { authenticateToken } = require('../middlewares/authenticateToken')
const router = express.Router()
const { getFriends, getRequest, addFriend, addRequest, deleteFriend } = require('../database/queries/queries_friends')
const { PostgrestError } = require('@supabase/supabase-js')



router.get('/', authenticateToken, async (req, res) => {
    // console.log('get friends')
    console.log('query ', JSON.stringify(req.query))
    const friends = await getFriends(req.user, req.query)

    if (req.query.imon == 'id_receiver'){
        console.log(friends)
    }
    // console.log(friends)
    // console.log(JSON.stringify(friends))
    if (friends instanceof PostgrestError){
        res.status(500).json({error: friends})
    } else {
        res.status(200).json(friends)
    }
})

router.post('/:id_sender/:id_receiver', authenticateToken, async (req, res) => {
    console.log('post friends (accept)')
    const {id_sender, id_receiver} = req.params
    
    console.log(`${id_sender} -> ${id_receiver}. ${req.user}`)

    // verificar se pessoa realmente mandou convite
    

    console.log('not pending opposite')

    switch(req.user){
        case id_sender:
            const pendingOpposite = await getRequest(id_receiver, id_sender, 'pending')
            if (pendingOpposite.length){
                console.log('pending opposite')
                const result = await addFriend(pendingOpposite[0].id_sender, pendingOpposite[0].id_receiver)
                console.log(`result add friend ${result} ${JSON.stringify(result)}`)
                res.status(200).json({msg: 'pedido de amizade foi aceito'})
            }
            const result1 = addRequest(id_sender, id_receiver)
            if (result1 instanceof PostgrestError){
                res.status(500).json({error: result})
            } else {
                res.status(200).json({msg: 'pedido de amizade foi enviado'})
            }
            break;
        case id_receiver:
            const pending = await getRequest(id_receiver, id_sender, 'pending')
            if (!pending){
                res.status(500).json({msg: 'ninguem te mandou request bobao'})
            }
            const result2 = await addFriend(id_sender, id_receiver)
            if (result2 instanceof PostgrestError){
                res.status(500).json({error: result})
            } else {
                res.status(200).json({msg: 'pedido de amizade foi aceito'})
            }
            break;
        default:
            res.status(500).json({msg: 'usuario n está nos parametros'})
            break;
    }


})

router.delete('/:other', authenticateToken, async (req, res) => {
    console.log('delete friends (delete)')
    const {other} = req.params
    console.log(`${req.params.id_sender}, ${req.user}`)
    // verificar se pessoa realmente mandou convite
    const friends = await getFriends(req.user, {status:'accepted'})
    if (!friends){
        return res.status(500).json({ msg: 'usuario não tem amigow'})
    }
    // pegar todos os items em que o id_receiver ou o id_sender é igual a other
    const commonRows = friends.filter((item) => {
        return item.id_sender == other || item.id_receiver == other
    })
    console.log('commonRows ', commonRows)
    if (!commonRows){
        return res.status(500).json({ msg: `${req.user} e ${other} não são amigos`})
    }

    const result = await deleteFriend(commonRows[0].id_sender, commonRows[0].id_receiver)
    console.log('result ', result)
    console.log(JSON.stringify(result))

    if (result instanceof PostgrestError){
        res.status(500).json({error: result})
    } else {
        res.status(200).json({result, msg: 'amizade foi pro saco'})
    }

})

module.exports = router