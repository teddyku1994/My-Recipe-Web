const jwt = require('jsonwebtoken')
const util = require('./util')

require('dotenv').config()

module.exports={
  assignToken:(userId) => {
    try {
      let token = jwt.sign({userId:userId}, process.env.JWT_KEY, {expiresIn:'1 day'})
      return token 
    } catch (err) {
      console.log(err)
      return util.error('Invalid Token')
    }
  },
  verifyToken:(req, res, next) => {
    try{
      if(!req.headers.authorization || !req.headers.authorization.includes("Bearer")) return res.json(util.error('Invalid Token'))
      let token = req.headers.authorization.replace('Bearer ', '')
      let decoded = jwt.verify(token, process.env.JWT_KEY)
      req.userId = decoded.userId
      next()
    } catch (err) {
      console.log(err)
      return res.json(util.error('Invalid Token'))
    }
  },
  verifyContentType: (req, res, next) => {
    try {
      if(req.header('Content-Type') !== "application/json") return res.json(util.error('Header is not in application/json'))
      next()
    } catch (err) {
      console.log(err)
      return res.json(util.error('Invalid Token'))
    }
  }
}