const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { getUser } = require('../database/queries/queries_users')

const authenticateToken = async (req, res, next) => {
    // console.log('\n authenticate')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // console.log('token', token)
    if (!token){
        return res.status(401).json({ error: 'Token de acesso requerido' })
    }

    try {
        // console.log('authenticate')
        const decoded = jwt.verify(token, JWT_SECRET)
        // console.log(decoded)
        const user = await getUser(decoded.username)
        
        if (!user){
            return res.status(401).json({error: 'Usuário não encontrado'})
        }
        // console.log(req.body)
        req.user = user.username
        next()
    } catch (error){
        console.log('token invalido')
        console.log(error)
        return res.status(403).json({error: 'Token inválido'})
    }
}


module.exports = {
    authenticateToken
}