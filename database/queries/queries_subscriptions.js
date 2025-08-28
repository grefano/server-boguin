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
        console.log('query add sub')
        console.log(`data ${data}`)
        console.log(`error ${error}`)
        return error ? error : data
    } catch (error){
        console.log('error ao add subscription', error)
        throw error
    }
}

async function removeSubscription(owner_id, subject_id, type=undefined){
    try {
        const {data, error} = await supabase.from('subscriptions').delete().eq('owner_id', owner_id).eq('subject_id', subject_id).select()
        console.log(`data ${data}`)
        console.log(`error ${error}`)
        return error ? error : data
    } catch (error){
        console.log('error ao remove subscription', error)
        throw error
    }
}

module.exports = {
    getSubscription, addSubscription, removeSubscription
}