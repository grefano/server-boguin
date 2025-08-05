const pool = require('../db')
// channel_id, public_id, thumb_public_id, title
async function getVideos() {
    const [ rows ] = await pool.query("SELECT * FROM video")
    return rows
    
}

async function addVideo(id, thumb_id, channel_id, title) {
    const [result] = await pool.query(`
    insert into video (id, id_thumb, id_channel, title) values (?, ?, ?, ?)
    `, [id, thumb_id, channel_id, title])   
    return result
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

module.exports = {
    getVideo, getVideos, addVideo, getChannelVideos
}
