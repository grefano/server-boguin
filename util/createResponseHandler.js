const { PostgrestError } = require('@supabase/supabase-js')

function createResponseHandler(res){
    return function handleQueryResult(result, msg = null){
        if (result instanceof PostgrestError){
            console.log('error', result)
            return res.status(500).json({error: result})
        } else {
            console.log('result', result)
            return res.status(200).json(msg == null ? result : {msg})
        }
    }
}

module.exports = {
    createResponseHandler
} 