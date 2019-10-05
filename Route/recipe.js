const express = require('express')
const recipe = require('../dao/recipe')
const likes = require('../dao/likes')
const cache = require('../dao/cache')
const util = require('../util/util')
const verification = require('../util/verification')
const router = express.Router()

router.get('/search', async (req, res) => {
  let {dishName, ingredient} = req.query
  let page = parseInt(req.query.page)
  if(isNaN(page)) res.json(util.error('Invalid Search'))
  let error = error => console.log(error)
  if(dishName) {
    dishName = dishName.replace(' ','')
    let result = await recipe.listByDishName(dishName, 6, page, error)
    return res.json(result)
  } else if(ingredient) {
    let result = await recipe.listByIngredient(ingredient, 6, page, error)
    return res.json(result)
  } else {
    return res.json(util.error('Invalid Search'))
  }
})

router.post('/search', verification.verifyContentType, async (req, res) => {
  try {
    let body = req.body
    let error = error => console.log(error)
    let result = await recipe.searchRecords(body, error)
    console.log(result)
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.json("Invalid Token")
  }
})

router.get('/search/hotKeywords', verification.verifyContentType, async (req, res) => {
  try {
    let error = error => console.log(error)
    let cacheResponse = await cache.getSetCache('hotKeywords', error)
    if(cacheResponse) return res.json(cacheResponse)
    let hotKeywords = await recipe.listHotKeywords(6, error)
    await cache.createSetCache('hotKeywords', 3600, JSON.stringify(hotKeywords), error)
    return res.json(hotKeywords)
  } catch (err) {
    console.log(err)
    return res.json(util.error('Invalid Token'))
  }
})

router.get('/recipe', async (req, res) => {
  try {
    let {id} = req.query
    let error = error => console.log(error)  
    if(!id) return res.redirect('/index.html')
    let cacheResponse = await cache.getHashCache('recipePage', id, error)
    if(cacheResponse) return res.json(cacheResponse)
    let recipeInfo = await recipe.listDish(id, error)
    if(recipeInfo.data.length <= 0) return res.redirect('/index.html')
    await cache.createHashCache('recipePage', id, JSON.stringify(recipeInfo), error)
    return res.json(recipeInfo)
  } catch (err) {
    console.log(err)
    return res.json(util.error('Invalid Token'))
  }
})

router.get('/recipe/hots', async (req, res) => {
  try {
    let error = error => console.log(error)
    let cacheResponse = await cache.getSetCache('hots', error)
    if(cacheResponse) return res.json(cacheResponse)
    let hotRecipes = await recipe.listHots(16, error)
    if(hotRecipes.data.length === 0) return res.json(util.error('No Result'))
    await cache.createSetCache('hots', 21600, JSON.stringify(hotRecipes), error)
    return res.json(hotRecipes)
  } catch (err) {
    console.log(err)
    return res.json(util.error('Invalid Token'))
  }
})

router.post('/recipe/like', verification.verifyContentType, async (req, res) => {
  let body = req.body
  let error = error => console.log(error)
  let likesCount = await likes.count(body.recipeId, error)
  return res.json(likesCount)
})

module.exports = router