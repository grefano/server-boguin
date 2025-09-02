const supabase = require('../../db')
const pageSize = 12
// channel_id, public_id, thumb_public_id, title
async function getVideos(page) {
    const { data, error } = await supabase.from('video').select('*').order('created_at', {ascending: false}).range(page*pageSize, page*pageSize+pageSize-1) //
    return error ? error : data 
    
}

async function getVideosSubscriptions(id, page) {
    console.log('videos sub')
    // pegar lista de inscrições do usuário
    // const { data: dataSubs, error: errorSubs } = await supabase.from('subscriptions').select('*').eq('owner_id', id)
    const {data, error} = await supabase.from('video').select('*').in('id_channel', 
        await supabase.from('subscriptions').select('subject_id').eq('owner_id', id).then(({data}) => data?.map(s => s.subject_id) || [])
    ).order('created_at', {ascending: false}).range(page*pageSize, page*pageSize+pageSize-1)
    
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
    getVideo, getVideos, getChannelVideos, getVideosSubscriptions, addVideo, deleteVideo
}
