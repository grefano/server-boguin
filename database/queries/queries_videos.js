const supabase = require('../../db')
// channel_id, public_id, thumb_public_id, title
async function getVideos() {
    const { data, error } = await supabase.from('video').select('*')
    return error ? error : data 
    
}

async function getVideosSubscriptions(id) {
    console.log('videos sub')
    // pegar lista de inscrições do usuário
    // const { data: dataSubs, error: errorSubs } = await supabase.from('subscriptions').select('*').eq('owner_id', id)
    const {data, error} = await supabase.from('video').select('*').in('id_channel', 
        await supabase.from('subscriptions').select('subject_id').eq('owner_id', id).then(({data}) => data?.map(s => s.subject_id) || [])
    )
    
    return data
}

async function addVideo(id, id_thumb, id_channel, title) {
    const { data, error } = await supabase.from('video').insert([{ id, id_thumb, id_channel, title }])
    return error ? error : data 
}


async function getVideo(_id) {
    const { data, error } = await supabase.from('video').select('*').eq('id', _id)
    return error ? error : data[0] 
}

async function getChannelVideos(_channel_id){
    // console.log(`get videos from user ${_channel_id}`)
    const { data, error } = await supabase.from('video').select('*').eq('id_channel', _channel_id)
    return error ? error : data
}

async function deleteVideo(_id) {
    const { data, error } = await supabase.from('video').delete().eq('id', _id)
    return error ? error : data
}



module.exports = {
    getVideo, getVideos, addVideo, getChannelVideos, deleteVideo, getVideosSubscriptions
}
