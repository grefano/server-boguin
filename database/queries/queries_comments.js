const supabase = require('../../db')


async function addComment(id_user, id_video, text){
    console.log('add comment')
    const {data, error} = await supabase.from('comments').insert([{id_user, id_video, text}]).select()
    console.log(data)
    console.log(error)
    return error ? error : data
}

async function getComments(id_user, id_video){
    console.log('get comment by user and video')
    const {data, error} = await supabase.from('comments').select('*').eq('id_user', id_user).eq('id_video', id_video)
    console.log(data)
    console.log(error)
    return error ? error : data
}

async function getCommentById(uuid){
    console.log('get comment by id')
    const {data, error} = await supabase.from('comments').select('*').eq('uuid', uuid)
    console.log(data)
    console.log(error)
    return error ? error : data
}

async function getCommentsByVideo(id_video){
    console.log('get comments by video')
    const {data, error} = await supabase.from('comments').select('*').eq('id_video', id_video)
    console.log(data)
    console.log(error)
    return error ? error : data
}

async function deleteCommentById(uuid){
    console.log('delete comment by id')
    const {data, error} = await supabase.from('comments').delete().eq('uuid', uuid)
    console.log(data)
    console.log(error)
    return error ? error : data
}

async function deleteCommentByUserAndVideo(id_user, id_video){
    console.log('delete comment by id')
    const {data, error} = await supabase.from('comments').delete().eq('id_user', id_user).eq('id_video', id_video)
    console.log(data)
    console.log(error)
    return error ? error : data
}

module.exports = {
    addComment, getComments, getCommentById, getCommentsByVideo, deleteCommentById, deleteCommentByUserAndVideo
}