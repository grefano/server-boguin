const pool = require('../../db')

async function addAccount(_username, _password){
    try{
        const query = 'insert into usuario (username, password_hash) values (?, ?)'
        const [result] = await pool.execute(query, [_username, _password])

    } catch (error){
        console.error('erro ao criar conta', error)
        throw error
    }
    
}

async function getUser(_username) {
    console.log(`get user ${_username}`)
    const [rows] = await pool.query(`
    select * from usuario where username = ?`,
    [_username])
    console.log(`getuser rows ${rows}`)
    return rows[0]
}


module.exports = {
    getUser, addAccount
}