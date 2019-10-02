const mysql = require ("../db/dbConnect.js")
const axios = require('axios')

module.exports = {
    sqlQuery: (sql,params,cb) => {
        if(params) {
            return new Promise((resolve,reject) => {
                mysql.con.query(sql,params,(err, result) => {
                if (err) reject(cb(err))
                else resolve(result)
                })
            });  
        } else {
            return new Promise((resolve,reject) => {
                mysql.con.query(sql, (err, result) => {
                if (err) reject(cb(err))
                else resolve(result)
                })
            });
        }
    },  
    sqlQuery2: (sql,arr,cb) => {
        return new Promise((resolve,reject) => {
            mysql.con.query(sql, [arr], (err, result) => {
            if (err) reject(cb(err))
            else resolve(result)
            })
        })
    },
    html: (link, time) => {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                axios.get(link).then((res) => resolve(res))
            }, 1000 * time);
        })
    }
}