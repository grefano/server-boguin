const express = require('express')
const { authenticateToken } = require('../middlewares/authenticateToken')
const router = express.Router()
const { getFriendRowsByUser, getFriendRowsByUsers, getFriendRowsBySenderAndReceiver, addFriendPending, acceptFriend, deleteFriend } = require('../database/queries/queries_friends')
const { createResponseHandler } = require('../util/createResponseHandler')



router.get('/', authenticateToken, async (req, res) => {
    // console.log('get friends')
    const handleResponse = createResponseHandler(res)
    console.log('query ', JSON.stringify(req.query))
    const friends = await getFriendRowsByUser(req.user, req.query)

    if (req.query.imon == 'id_receiver'){
        console.log(friends)
    }
    // console.log(friends)
    // console.log(JSON.stringify(friends))
    handleResponse(friends)
})

router.post('/:id_sender/:id_receiver', authenticateToken, async (req, res) => {
    console.log('post friends (accept)')
    const handleResponse = createResponseHandler(res)
    const {id_sender, id_receiver} = req.params
    
    console.log(`${id_sender} -> ${id_receiver}. ${req.user}`)

    // verificar se pessoa realmente mandou convite
    

    console.log('not pending opposite')

    switch(req.user){
        case id_sender: // ta tentando enviar um request
            const opposite = await getFriendRowsBySenderAndReceiver(id_receiver, id_sender, 'pending')
            if (opposite.length > 0){
                const resultacceptopposite = await acceptFriend(opposite[0].id_sender, opposite[0].id_receiver)
                handleResponse(resultacceptopposite, 'pedido de amizade foi aceito')
            }
            const relations = await getFriendRowsByUsers(id_sender, id_receiver)
            console.log('relations', relations)
            if (relations.length > 0){
                return res.status(500).json({msg: 'já existe relação entre os usuários'})
            }
            const result1 = await addFriendPending(id_sender, id_receiver)
            handleResponse(result1, 'pedido de amizade foi enviado')

            break;
        case id_receiver: // ta tentando aceitar o request
            const pending = await getFriendRowsBySenderAndReceiver(id_receiver, id_sender, 'pending')
            if (!pending){
                return res.status(500).json({msg: 'ninguem te mandou request bobao'})
            }
            const result2 = await acceptFriend(id_sender, id_receiver)
            handleResponse(result2, 'pedido de amizade foi aceito')
            break;
        default:
            res.status(500).json({msg: 'usuario n está nos parametros'})
            break;
    }


})

router.delete('/:other', authenticateToken, async (req, res) => {
    const handleResponse = createResponseHandler(res)
    console.log('delete friends (delete)')
    const {other} = req.params
    console.log(`${req.params.id_sender}, ${req.user}`)
    console.log(req.query)
    const {status} = req.query
    // verificar se pessoa realmente mandou convite
    const friends = await getFriendRowsByUser(req.user, {status})
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

    handleResponse(result, 'amizade foi pro saco')

})

module.exports = router