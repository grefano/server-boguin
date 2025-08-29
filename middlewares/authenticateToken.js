const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { getUser } = require('../database/queries/queries_users')

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (!token){
        return res.status(401).json({ error: 'Token de acesso requerido' })
    }

    try {
        console.log('authenticate')
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await getUser(decoded.username)
        if (!user){
            return res.status(401).json({error: 'Usuário não encontrado'})
        }
        req.user = user.username
        next()
    } catch (error){
        console.log(error)
        return res.status(403).json({error: 'Token inválido'})
    }
}


module.exports = {
    authenticateToken
}