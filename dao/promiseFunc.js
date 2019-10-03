const mysql = require ("../db/dbConnect.js")
const axios = require('axios')

module.exports = {
    sqlQuery: (sql,params,cb) => {
        if(params) {
            return new Promise((resolve,reject) => {
                mysql.pool.query(sql,params,(err, result) => {
                if (err) reject(cb(err))
                else resolve(result)
                })
            });  
        } else {
            return new Promise((resolve,reject) => {
                mysql.pool.query(sql, (err, result) => {
                if (err) reject(cb(err))
                else resolve(result)
                })
            });
        }
    },
    escape: (variable) => {
        variable = mysql.pool.escape(variable)
        console.log(variable)
        return variable
    },
    html: (link, time) => {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                axios.get(link).then((res) => resolve(res))
            }, 1000 * time);
        })
    }
}