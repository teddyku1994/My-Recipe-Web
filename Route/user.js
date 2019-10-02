const express = require('express')
const router = express.Router()
const user = require('../dao/user')
const profile = require('../dao/profile')
const favorite = require('../dao/favorite')
const likes = require('../dao/likes')
const cache = require('../dao/cache')
const util = require('../util/util')
const file = require('../util/file')
const verification = require('../util/verification')

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
  let error = error => console.log(error)
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

//! Still require refatoring - Add delete S3 file
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

//! Still require refatoring - Add delete S3 file
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

//! Still require refatoring - Add delete S3 file
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

router.post('/user/recipe', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  let body = req.body
  const {status} = req.body
  let error = error => console.log(error)
  let userId = req.userId

  if(status === "list"){
    let recipeList = await profile.listRecipe(userId, error)
    return res.json(recipeList)
  } else if(status === "update"){
    let userRecipe = await profile.userRecipe(userId, body.recipeId, error)
    res.json(userRecipe)
  } else {
    res.json(util.error('Invalid Method'))
  }
})

router.delete('/user/recipe', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  let body = req.body
  let error = error => console.log(error)
  cache.deleteCahe2('recipePage', body.recipeId)
  let result = await profile.deleteRecipe(body, req.userID, error)
  res.json(result)
})

router.post('/user/favorite', verification.verifyContentType, verification.verifyToken, async (req, res) => {
    let body = req.body
    let {status} = body
    body.recipeId = parseInt(body.recipeId)
    if(isNaN(body.recipeId)) return res.json(util.error('Invalid Token'))
    let error = error => console.log(error)
    if(status === "save") {
      let result = await favorite.insert(req.userId, body.recipeId, error)
      if(!result.insertId) return res.json(util.error('Insert Fail'))
      return res.json({status: "Success"})
    } else if(status === "unsave") {
      let result = await favorite.delete(req.userId, body.recipeId, error)
      if(!result.affectedRows) return res.json(util.error('Delete Fail'))
      return res.json({status: "Success"})
    } else if(status === "check") {
      let result = await favorite.checkExist(req.userId, body.recipeId, error)
      return res.json(result)
    } else if(status === "list") {
      let result = await favorite.list(req.userId, error)
      return res.json(result)
    } else {
      res.json(util.error('Invalid Token'))
    }
    
})

router.post('/user/like', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  let body = req.body
  let {status} = body
  body.recipeId = parseInt(body.recipeId)
  if(isNaN(body.recipeId)) return res.json(util.error('Invalid Token'))
  let error = error => console.log(error)
  if(status === "like") {
    let result = await likes.insert(req.userId, body.recipeId, error)
    if(!result.insertId) return res.json(util.error('Insert Fail'))
    return res.json({status: "Success"})
  } else if(status === "unlike") {
    let result = await likes.delete(req.userId, body.recipeId, error)
    if(!result.affectedRows) return res.json(util.error('Delete Fail'))
    return res.json({status: "Success"})
  } else if(status === "check") {
    let result = await likes.checkExist(req.userId, body.recipeId, error)
    return res.json(result)
  } else {
    res.json(util.error('Invalid Token'))
  }
})

module.exports = router