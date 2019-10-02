const express = require('express')
const router = express.Router()
const verification = require('../util/verification')
const user = require('../dao/user')
const favorite = require('../dao/favorite')
const likes = require('../dao/likes')
const util = require('../util/util')
const profile = require('../dao/profile')
const file = require('../util/file')
const cache = require('../dao/cache')
const recipe = require('../dao/recipe')

router.use(express.json())

router.post('/user/verify', verification.verifyToken, async (req, res) => {
  return res.json({status:"Valid Token"})
})

router.post('/user/signup', verification.verifyContentType, async (req,res) => {
  let body = req.body
  let error = error => console.log(error)
  let accessToken = await user.signup(body, error)
  res.json(accessToken)
})

router.post('/user/signin', verification.verifyContentType, async (req, res) => {
  let body = req.body
  let error = error => console.log(error)
  let token = await user.signin(body, error)
  return res.json(token)
})

router.post('/user/profile', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  let error = error => res.json(error)
  let body = req.body
  if(body.search === 'basicInfo') {
    let result = await profile.getInfo(req.userId, error)
    return res.json(result)
  } else if(body.search === 'favInfo') {
    let result = await favorite.list(req.userId, 4, body.page, error)
    return res.json(result)
  }  else if(body.search === 'updatePw') {
    let result = await user.changePw(body, req.userId, error)
    return res.json(result)
  } else {
    res.json(util.error('Invalid Token'))
  } 
})

router.post('/user/profile/updateFile', verification.verifyToken, file.uploadProfileImg, async (req, res) => {
  let error = error => res.json(error)
  let body = req.body
  let info = []
  let dp
  req.files.profilePic ? dp = req.files.profilePic[0].location.replace('https://myrecipsebucket.s3.amazonaws.com', '') : dp = null
  info.push(body.name)
  info.push(dp)
  let result = await profile.update(verify.userId, info, error)
  // if(body.dp) {
  //   let src = body.dp.split('/').slice(-1)[0]
  //   file.deleteS3Obj(`profile/21/${src}`, error)
  // }
  return res.json(result)
})

router.post('/user/recipe/upload', file.uploadRecipe, async (req,res) => {
  if(!req.headers.authorization) {
    return res.redirect('/index.html')
  }
  try {
    let body = req.body
    let file = req.files
    let token = req.headers.authorization.replace('Bearer ', '')
    let verify = jwt.verifyToken(token)
    if (verify.error) return res.redirect('/index.html')
    let userId = verify.userId
    console.log(userId)
    let result = await profile.createRecipe(body, file, userId)
    res.json(result)
  } catch (err) {
    console.log(err)
  }
})

router.post('/user/recipe/update', file.uploadRecipe, cache.deleteCahe, async (req,res) => {
  if(!req.headers.authorization) {
    return res.redirect('/index.html')
  }
  try {
    let body = req.body
    let file = req.files
    let token = req.headers.authorization.replace('Bearer ', '')
    let verify = jwt.verifyToken(token)
    if (verify.error) return res.redirect('/index.html')
    let userId = verify.userId
    let result = await profile.updateRecipe(body, file, userId)
    res.json(result)
  } catch (err) {
    res.json(err)
  }
})

router.post('/user/recipe', async (req,res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  if(!req.headers.authorization) {
    return res.redirect('/index.html')
  }
  body = req.body
  const {status} = req.body
  let error = error => res.json(error)
  let token = req.headers.authorization.replace('Bearer ', '')
  let verify = await jwt.verifyToken(token)
  if (verify.error) return res.redirect('/index.html')
  let userId = verify.userId

  if(status === "list"){
    let result = await profile.listRecipe(userId, error)
    return res.json(result)
  } else if(status === "update"){
    let result = await user.check(userId, body.recipeId, error)
    if(result.length === 0) return res.json(util.error('Invalid Token'))
    let result2 = await recipe.listDish(body.recipeId, error)
    res.json(result2)
  } else if(status === "delete") {
    cache.deleteCahe2('recipePage', body.recipeId)
    let result = await profile.deleteRecipe(body, userId, error)
    res.json(result)
  } else {
    res.json(util.error('Invalid Method'))
  }
})

router.post('/user/favorite', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  if(!req.headers.authorization || !req.headers.authorization.includes("Bearer")) {
    return res.json(util.error('Not Authorized'))
  }
    let body = req.body
    let error = error => res.json(util.error(error))
    let token = req.headers.authorization.replace('Bearer ', '')
    let verify = jwt.verifyToken(token)
    if (verify.error) return res.redirect('/index.html')

    if(body.status === "save") {
      let result = await favorite.insert(verify.userId, body.recipeId, error)
      if(!result.insertId) return res.json(util.error('Insert Fail'))
      return res.json({status: "Success"})
    } else if(body.status === "unsave") {
      let result = await favorite.delete(verify.userId, body.recipeId, error)
      if(!result.affectedRows) return res.json(util.error('Delete Fail'))
      return res.json({status: "Success"})
    } else if(body.status === "check") {
      let result = await favorite.check(verify.userId, body.recipeId, error)
      return res.json(result)
    } else if(body.status === "list") {
      let result = await favorite.list(verify.userId, error)
      return res.json(result)
    } else {
      res.json(util.error('Invalid Token'))
    }
    
})

router.post('/user/like', async (req, res) => {
  if(req.header('Content-Type') !== "application/json") {
    return res.json(util.error('Header is not in application/json'))
  }
  if(!req.headers.authorization || !req.headers.authorization.includes("Bearer")) {
    return res.json(util.error('Not Authorized'))
  }
    let body = req.body
    let error = error => res.json(util.error(error))
    let token = req.headers.authorization.replace('Bearer ', '')
    let verify = jwt.verifyToken(token)
    if (verify.error) return res.redirect('/index.html')

    if(body.status === "like") {
      let result = await likes.insert(verify.userId, body.recipeId, error)
      if(!result.insertId) return res.json(util.error('Insert Fail'))
      return res.json({status: "Success"})
    } else if(body.status === "unlike") {
      let result = await likes.delete(verify.userId, body.recipeId, error)
      if(!result.affectedRows) return res.json(util.error('Delete Fail'))
      return res.json({status: "Success"})
    } else if(body.status === "check") {
      let result = await likes.check(verify.userId, body.recipeId, error)
      return res.json(result)
    } else {
      res.json(util.error('Invalid Token'))
    }
})

module.exports = router