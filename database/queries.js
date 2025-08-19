const pool = require('../db')
// channel_id, public_id, thumb_public_id, title
async function getVideos() {
    const [ rows ] = await pool.query("SELECT * FROM video")
    console.log(rows)
    
    return rows
    
}

async function addVideo(id, thumb_id, channel_id, title) {
    const [result] = await pool.query(`
        insert into video (id, id_thumb, id_channel, title) values (?, ?, ?, ?)
            `, [id, thumb_id, channel_id, title])   
    return result
}

async function addAccount(_username, _password){
    try{
        const query = 'insert into usuario (username, password_hash) values (?, ?)'
        const [result] = await pool.execute(query, [_username, _password])

    } catch (error){
        console.error('erro ao criar conta', error)
        throw error
    }
    
}
async function getVideo(_id) {
    const [rows] = await pool.query(`
    select * from video where id = ?`,
    [_id]   
    )
}

async function getChannelVideos(_channel_id){
    const [rows] = await pool.query(`
    select * from video where id_channel = ?`,
    [_channel_id]
    )
    return rows
}

async function deleteVideo(_id) {
    const [result] = await pool.query(`
        delete from video where id = ?`,
    [_id])
    return result
}

async function getUser(_username) {
    const [rows] = await pool.query(`
    select * from usuario where username = ?`,
    [_username])
    return rows[0]
}


module.exports = {
    getVideo, getVideos, addVideo, getChannelVideos, deleteVideo, getUser, addAccount
}
