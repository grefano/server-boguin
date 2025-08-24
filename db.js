require('dotenv').config()
// const mysql = require('mysql2/promise')

// console.log(typeof mysql.createPool)
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

const { createClient } = require('@supabase/supabase-js')

const express = require('express');
const supabaseUrl = process.env.SUBABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

module.exports = supabase