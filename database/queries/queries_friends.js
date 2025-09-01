const supabase = require('../../db')



// selecionar todos os requests em que um usuário está presente
async function getFriendRowsByUser(user, params){
    let query = supabase.from('friend').select('*')
    if (params.imon){
        query = query.eq(params.imon, user)
    } else {
        query = query.or(`id_sender.eq.${user},id_receiver.eq.${user}`)
    }
    if(params.status){
        query = query.eq('status', params.status)
    }
    const {data, error} = await query
    return error ? error : data
}

async function getFriendRowsByUsers(id1, id2){
    const {data, error} = await supabase.from('friend').select('*').or(`id_sender.eq.${id1},id_receiver.eq.${id1}`).or(`id_sender.eq.${id2},id_receiver.eq.${id2}`)
    return error ? error : data
}



async function getFriendRowsBySenderAndReceiver(id_sender, id_receiver, status){
    const {data, error} = await supabase.from('friend').select('*').eq('id_sender', id_sender).eq('id_receiver', id_receiver).eq('status', status)
    return error ? error : data
}

async function addFriendPending(id_sender, id_receiver){
    const {data, error} = await supabase.from('friend').insert([{id_sender, id_receiver, status: 'pending'}]).select()
    return error ? error : data
}

async function acceptFriend(id_sender, id_receiver){
    // mudar request status de pending para accepted
    const {data, error} = await supabase.from('friend').update({status: 'accepted'}).eq('id_sender', id_sender).eq('id_receiver', id_receiver)
    return error ? error : data
}

async function deleteFriend(id_sender, id_receiver){
    const {data, error} = await supabase.from('friend').delete().eq('id_sender', id_sender).eq('id_receiver', id_receiver)
    return error ? error : data
}


module.exports = {
    getFriendRowsByUser, getFriendRowsByUsers, getFriendRowsBySenderAndReceiver, addFriendPending, acceptFriend, deleteFriend
}