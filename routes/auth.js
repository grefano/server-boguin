const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { getUser, addAccount } = require('../database/queries/queries_users')
const JWT_SECRET = process.env.JWT_SECRET


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // console.log(token)
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
        req.user = user
        next()
    } catch (error){
        
        return res.status(403).json({error: 'Token inválido'})
    }
}

router.post('/login', express.json(), async (req, res) => {
    
    try {
        console.log('login')
        console.log(req.body)
        const { username, password } = req.body
        const user = await getUser(username)
        if (!user) {
            return res.status(401).json({ error: 'Usuário não existe'})
        }
        console.log(user)
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta'})

        }   

        const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token })
    } catch (error) {
        console.error('Error during login:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/register', express.json(), async (req, res) => {
    try {
        console.log('register')
        console.log(req.body)
        const { username, password } = req.body
        const user = await getUser(username)
        console.log(`user ${user}`)
        if (user){
            return res.status(409).json({ error: 'já existe um usuário com esse nome'})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        console.log(hashedPassword)
        await addAccount(username, hashedPassword)
        const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '1h' })
        console.log('registrasao deu certo')

        return res.status(200)
    } catch (error) {
        console.error('error during sign up:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/verify-token', authenticateToken, (req, res) => {
    // console.log('token válido')
    res.status(200).json({msg: 'achei irado'})
})

router.get('/refresh-token', authenticateToken, (req, res) => {
    const newToken = jwt.sign(
        {usernmae: req.user.username},
        JWT_SECRET,
        { expiresIn: '1h'}
    )
    res.json({ token: newToken })
})

module.exports = router