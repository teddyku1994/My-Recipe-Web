const express = require('express')
const user = require('../dao/user')
const profile = require('../dao/profile')
const favorite = require('../dao/favorite')
const likes = require('../dao/likes')
const cache = require('../dao/cache')
const util = require('../util/util')
const file = require('../util/file')
const verification = require('../util/verification')

const router = express.Router()
router.use(express.json())

router.post('/user/verify', verification.verifyToken, async (req, res) => {
  res.json({status:"Valid Token"})
})

router.post('/user/signup', verification.verifyContentType, async (req,res) => {
  try {
    let body = req.body
    let accessToken = await user.signup(body)
    res.json(accessToken)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/user/signin', verification.verifyContentType, async (req, res) => {
  try {
    let body = req.body
    let error = error => console.log(error)
    let token = await user.signin(body, error)
    if(!token.error) res.json(token)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/user/profile', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  try {
    let error = error => console.log(error)
    let body = req.body
    if(body.search === 'basicInfo') {
      let result = await profile.getInfo(req.userId, error)
      res.json(result)
    } else if(body.search === 'favInfo') {
      let result = await favorite.list(req.userId, 4, body.page, error)
      res.json(result)
    } else if(body.search === 'updatePw') {
      let result = await user.changePw(body, req.userId, error)
      res.json(result)
    } else {
      res.json(util.error('Invalid Token'))
    } 
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.put('/user/profile', verification.verifyToken, file.uploadProfileImg, async (req, res) => {
  try {
    let error = error => console.log(error)
    let body = req.body
    let info = []
    let dp
    req.files.profilePic ? dp = req.files.profilePic[0].location.replace('https://myrecipsebucket.s3.amazonaws.com', '') : dp = null
    info.push(body.name)
    info.push(dp)
    let result = await profile.update(req.userId, info, error)
    res.json(result)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/user/recipe/upload', verification.verifyToken, file.uploadRecipe, async (req,res) => {
  try {
    let body = req.body
    let file = req.files
    let userId = req.userId
    let result = await profile.createRecipe(body, file, userId)
    res.json(result)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.put('/user/recipe/upload', verification.verifyToken, file.uploadRecipe, cache.deleteCache, async (req,res) => {
  try {
    let body = req.body
    let file = req.files
    let userId = req.userId
    let error = error => console.log(error)
    await profile.delPrevRecipeData(body, file, userId, error)
    let resultStatus = await profile.updateRecipe(body, file, userId)
    res.json(resultStatus)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/user/recipe', verification.verifyContentType, verification.verifyToken, async (req,res) => {
  try {
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
  } catch (err) {
    util.errorHandling(err, res)
  } 
})

router.delete('/user/recipe', verification.verifyContentType, verification.verifyToken, cache.deleteCache, async (req,res) => {
  try {
    let body = req.body
    let error = error => console.log(error)
    let result = await profile.deleteRecipe(body, req.userID, error)
    res.json(result)
  } catch (err) {
    util.errorHandling(err, res)
  }
})

router.post('/user/favorite', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  try {
    let body = req.body
    let {status} = body
    let error = error => console.log(error)
    body.recipeId = parseInt(body.recipeId)
    if(isNaN(body.recipeId)) return res.json(util.error('Invalid Token'))

    if(status === "save") {
      let result = await favorite.insert(req.userId, body.recipeId, error)
      if(!result.insertId) return res.json(util.error('Insert Fail'))
      res.json({status: "Success"})
    } else if(status === "unsave") {
      let result = await favorite.delete(req.userId, body.recipeId, error)
      if(!result.affectedRows) return res.json(util.error('Delete Fail'))
      res.json({status: "Success"})
    } else if(status === "check") {
      let result = await favorite.checkExist(req.userId, body.recipeId, error)
      res.json(result)
    } else if(status === "list") {
      let result = await favorite.list(req.userId, error)
      res.json(result)
    } else {
      res.json(util.error('Invalid Token'))
    }

  } catch(err) {
    util.errorHandling(err, res)
  } 
})

router.post('/user/like', verification.verifyContentType, verification.verifyToken, async (req, res) => {
  try {
    let body = req.body
    let {status} = body
    let error = error => console.log(error)

    body.recipeId = parseInt(body.recipeId)
    if(isNaN(body.recipeId)) return res.json(util.error('Invalid Token'))

    if(status === "like") {
      let result = await likes.insert(req.userId, body.recipeId, error)
      if(!result.insertId) return res.json(util.error('Insert Fail'))
      res.json({status: "Success"})
    } else if(status === "unlike") {
      let result = await likes.delete(req.userId, body.recipeId, error)
      if(!result.affectedRows) return res.json(util.error('Delete Fail'))
      res.json({status: "Success"})
    } else if(status === "check") {
      let result = await likes.checkExist(req.userId, body.recipeId, error)
      res.json(result)
    } else {
      res.json(util.error('Invalid Token'))
    }
    
  } catch (err) {
    util.errorHandling(err, res)
  }
})

module.exports = router