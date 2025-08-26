const supabase = require('../../db')

async function getSubscription(owner_id, subject_id, type="all"){
    try {
        const {data, error} = await supabase.from('subscriptions').select('*').eq('owner_id', owner_id).eq('subject_id', subject_id).eq('type', type)
        return error ? error : data
    } catch (error){
        console.log('error ao get subscription', error)
        throw error
    }
}

async function addSubscription(owner_id, subject_id, type="all"){
    try {
        const {data, error} = await supabase.from('subscriptions').insert([{owner_id, subject_id, type}]).select()
        return error ? error : data
    } catch (error){
        console.log('error ao add subscription', error)
        throw error
    }
}

async function removeSubscription(owner_id, subject_id, type=undefined){
    try {
        const {data, error} = supabase.from('subscriptions').delete().eq('subject_id', subject_id)
        return error ? error : data
    } catch (error){
        console.log('error ao remove subscription', error)
        throw error
    }
}

module.exports = {
    getSubscription, addSubscription, removeSubscription
}