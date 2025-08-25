const supabase = require('../../db')

async function addAccount(_username, _password){
    try{
        // const query = 'insert into usuario (username, password_hash) values (?, ?)'
        // const [result] = await pool.execute(query, [_username, _password])
        const { data, error } = await supabase.from('usuario').insert([{username: _username, password_hash: _password}])
        return error ? error : data
    } catch (error){
        console.error('erro ao criar conta', error)
        throw error
    }
    
}

async function getUser(_username) {
    console.log(`get user ${_username}`)

    const { data, error } = await supabase.from('usuario').select('*').eq('username', _username)
    return error ? error : data 
}


module.exports = {
    getUser, addAccount
}