require('dotenv').config()



const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)
module.exports = supabase
