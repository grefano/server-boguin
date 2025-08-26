const supabase = require('../../db')



async function addSubscription(owner_id, subject_id, type="all"){
    try {
        const {data, error} = await supabase.from('subscriptions').insert([{owner_id, subject_id, type}]).select()
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
        const {data, error} = supabase.from('subscriptions').delete().eq('subject_id', subject_id)
        return error ? error : data
    } catch (error){
        console.log('error ao remove subscription', error)
        throw error
    }
}

module.exports = {
    addSubscription, removeSubscription
}