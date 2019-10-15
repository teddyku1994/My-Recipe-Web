const bcrypt = require('bcryptjs')
const axios = require('axios')
const db = require('../db/dbConnect')
const connection = require('./promiseFunc')
const verification = require('../util/verification')
const util = require('../util/util')

module.exports = {
  signup: async (body) => {
    try {
      if(!body.name||!body.email||!body.pw||!body.confirmPw) {
        return util.error('All fields required')
      }
      if(body.pw !== body.confirmPw || body.pw.length < 8){
        return util.error('Invalid Token')
      }
      return new Promise((resolve, reject) => {
        db.pool.getConnection(async (error, con) => {
          let err = error => {
            reject(error)
            return con.rollback(() => con.release())
          }
          con.beginTransaction(async (error) => {
            try {
              let sql = 'SELECT * FROM user WHERE email = ? AND provider = ?'
              let emailExist = await connection.sqlQuery(sql, [body.email, 'native'], err)
              if(emailExist.length > 0) {
                return util.error('Email Taken')
              }
              let password = await bcrypt.hash(body.pw, 10)
              let user = [body.email, password, body.name]
              let sql2 = 'INSERT INTO user (email, password, name) VALUES (?)'
              let result = await connection.sqlQuery(sql2, [user], err)
              con.commit(error => {
              if(error) return err(error)
              let token = verification.assignToken(result.insertId)
              let accessToken = {
                accessToken: token,
              }
                resolve(accessToken)
              })
            } catch (err) {
              con.rollback()
              return util.error('Invalid Token')
            }
          })
        })
      })
    } catch (err) {
      throw err
    }
  },
  signin: async (body, error) => {
    try {
      if(body.provider === "native") {
        if(!body.email||!body.pw||!body.provider) {
          return error.util('All fields required')
        }
        let sql = 'SELECT * FROM user WHERE email = ? AND provider = ?'
        let account = await connection.sqlQuery(sql,[body.email, body.provider],error)
        if(account.length === 0) return util.error('Invalid Token')
        let password1 = body.pw
        let password2 = account[0].password
        let isMatch = await bcrypt.compare(password1, password2)
        if(!isMatch) return util.error('Invalid Token')
        let token = verification.assignToken(account[0].id)
        let userInfo = {
          accessToken: token
        }
        if(account[0].image) {
          !account[0].image.includes('https') ? userInfo.dp = `https://d1lpqhjzd6rmjw.cloudfront.net${account[0].image}` : userInfo.dp = account[0].image
        }
        return userInfo
      } else if(body.provider === "facebook") {
        let fbPath = `https://graph.facebook.com/v4.0/me?fields=name,email,picture.height(350).width(350)&access_token=${body.accessToken}`
        let fbFeedback = await axios(fbPath)
        let userData = fbFeedback.data
        let sql = 'SELECT * FROM user WHERE email = ? AND provider = ?'
        let accountExist = await connection.sqlQuery(sql, [userData.email, body.provider], error)
        if(accountExist.length > 0) {
          let sql = 'UPDATE user SET email = ? WHERE id = ?'
          await connection.sqlQuery(sql, [userData.email, accountExist[0].id], error)
          let token = verification.assignToken(accountExist[0].id)
          let userInfo = {
            accessToken: token,
            dp: userData.picture.data.url
          }
          return userInfo
        } else {
          let password = 'facebooklogin'
          let user = [userData.name, userData.email, userData.picture.data.url, body.provider, password]
          let sql = `INSERT INTO user (name, email, image, provider, password) VALUES (?)`
          let result = await connection.sqlQuery(sql, [user], error)
          if(result.insertId) {
            let token = verification.assignToken(result.insertId)
            let userInfo = {
              accessToken: token,
              dp: userData.picture.data.url
            }
            return userInfo
          }
          return "Signin Failed"
        }
      }
    } catch (err) {
      throw err
    }
  },
  changePw: async (body, userId, error) => {
    try {
      let oldPw = body.oldPw
      let newPw = body.newPw
      if(!oldPw || !newPw) return util.error('Invalid Token')
      let sql = 'SELECT password FROM user WHERE id = ?'
      let result = await connection.sqlQuery(sql, userId, error)
      let isMatch = await bcrypt.compare(oldPw, result[0].password)
      if(!isMatch) return util.error('Invalid Password')
      newPw = await bcrypt.hash(newPw, 10)
      let sql2 = `UPDATE user SET password = ? WHERE id = ?`
      let result2 = await connection.sqlQuery(sql2, [newPw, userId], error)
      if(result2.affectedRows === 1) return {status:"Success"}
      return util.error("Invalid Token")
    } catch (err) {
      throw err
    }
  }
}