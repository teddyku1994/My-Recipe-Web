const mysql = require('mysql')
const bluebird = require('bluebird')
const redis = require('redis')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

require('dotenv').config()

const pool = mysql.createPool({
  connectionLimit : 30,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: process.env.MYSQL_DB,
});

pool.getConnection((error, connection) => {
  console.log('MySQL connected')
  if (error) {
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('Database connection was closed.')
      }
      if (error.code === 'ER_CON_COUNT_ERROR') {
          console.log('Database has too many connections.')
      }
      if (error.code === 'ECONNREFUSED') {
          console.log('Database connection was refused.')
      }
      if (connection) connection.release()
      return
  }
});

const REDIS_PORT = process.env.PORT || 6379

const client = redis.createClient(REDIS_PORT)

client.on('connect', () => {
  console.log(`Redis Connected on port ${REDIS_PORT}`)
})

module.exports = {
  core: mysql,
  con: pool,
  redis: client,
}