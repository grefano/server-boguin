const supabase = require('../../db')


async function getWatchTime(id_user, id_video){
    const {data, error} = await supabase.from('watchtime').select('*').eq('id_user', id_user).eq('id_video', id_video)
    return error ? error : data
}

async function getWatchedVideos(id_user, page){
    const {data, error} = await supabase.from('watchtime').select('video(*)').eq('id_user', id_user).order('created_at', {ascending: false}).range(page*5, page*5+4)
    return error ? error : data.map(item => item.video)
}

async function addWatchTime(id_user, id_video, time){
    console.log('time', time)
    const prevWatchTime = await getWatchTime(id_user, id_video)
    console.log('prev time', prevWatchTime)
    if (prevWatchTime.length == 0){
        console.log('inserir watchtime')
        const {data, error} = await supabase.from('watchtime').insert([{id_user, id_video, time}])
        return error ? error : data
    } else {
        console.log('atualizar watchtime')
        const newtime = parseInt(prevWatchTime[0].time)+parseInt(time)
        const {data, error} = await supabase.from('watchtime').update({time: newtime}).eq('id_user', id_user).eq('id_video', id_video).select()
        return error ? error : data
    }

}

async function getVideoViewsAmount(id_video){
    const {data, error} = (await supabase.from('watchtime').select('created_at').eq('id_video', id_video))
    return error ? error : data.length
}

module.exports = {
    addWatchTime, getWatchTime, getWatchedVideos, getVideoViewsAmount
}