const connection = require('../dao/promiseFunc')
const crawlRecipe = require('../util/crawl')
const crawl = require('../dao/crawl')
const util = require ('../util/util')

module.exports = {
  listDish: async (recipeId, error) => {
    let sql = `
    SELECT recipe.*, ingredient.name, ingredient.amount
    FROM recipe
    LEFT JOIN ingredient ON recipe.id = ingredient.recipe_id
    WHERE recipe.id = ${recipeId}
    GROUP BY recipe.id, ingredient.id ORDER BY id;
    `
    let result = await connection.sqlQuery(sql, error)
    let sql2 = `SELECT method.step, method.image FROM method WHERE recipe_id = ${recipeId}`
    let result2 = await connection.sqlQuery(sql2, error)
  
    const newResult = result.map(item => {
      container = {}
      container.id = item.id
      container.title = item.title
      !item.image.includes("https://") ? container.mainImage = `https://d1lpqhjzd6rmjw.cloudfront.net${item.image}` : container.mainImage = item.image
      container.likes = item.likes
      container.user_id = item.user_id
      container.ingredient = item.name.split(',')
      container.amount = item.amount.split(',')
      container.step = result2.map(steps => steps.step)
      container.image = result2.map(images => !images.image.includes("https://") ? `https://d1lpqhjzd6rmjw.cloudfront.net${images.image}` : images.image)
      return container
    })
    console.log(newResult)
    let data = {
      data:newResult
    }
  
    return data
  },
  listByIngredient: async (ingredient, limit, page, error) => {
    try {
      let data = {}
      let offset = page*limit
      let name = ''
      if(!ingredient.includes(',')) {
        name += `name LIKE '%${ingredient}%'`
      } else {
        let ingredients = ingredient.split(',')
        let args = ingredients.map((item) => `name LIKE '%${item}%'`).join(` AND `)
        name += args
      }
      let sql = `SELECT recipe_id FROM ingredient WHERE ${name}`
      let result = await connection.sqlQuery(sql, error)
      if(result.length < 4 && page === 0) {
        await crawlRecipe.ingredientCralwer(ingredient)
        return crawl.crawlResult2(ingredient, limit, 0, error)
      }
      let ids = await result.map((item) => {
        let ids = ''
        return ids += item.recipe_id
      })
      let sql2 = `SELECT * FROM recipe WHERE id IN (${ids.join(',')}) LIMIT ${limit} OFFSET ${offset}`
      let newResult = await connection.sqlQuery(sql2, error)
      let sql3 = `SELECT COUNT(*) FROM recipe WHERE id IN (${ids.join(',')})`
      let total = await connection.sqlQuery(sql3, error)
      for(let i = 0; i<newResult.length; i++) {
        if(!newResult[i].image.includes("https://")) {
          newResult[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${result[i].image}`
        }
      }
      data.data = newResult
      let totalPage = total[0]['COUNT(*)']
      let newLimit = (page+1)*limit
      if(totalPage - newLimit > 0) {
        data.page = page+1
      }
      if(Math.floor(totalPage/limit) > 0 && totalPage > limit) {
        data.totalPage = Math.floor(totalPage/limit)
      }
      return data
    } catch (err) {
      console.log(err)
    }
    
  },
  listByDishName: async (dishName, limit, page, error) => {
    try {
      let data = {}
      let offset = page*limit
      let sql = `SELECT * FROM recipe WHERE title LIKE '%${dishName}%' LIMIT ${limit} OFFSET ${offset}`
      let result = await connection.sqlQuery(sql, error)
      if(result.length < 3 && page === 0) {
        await crawlRecipe.recipeCrawler(dishName)
        return crawl.crawlResult(dishName, limit, 0, error)
      } else {
        let sql2 = `SELECT COUNT(*) FROM recipe WHERE title LIKE '%${dishName}%'`
        let total = await connection.sqlQuery(sql2, error)
        for(let i = 0; i<result.length; i++) {
          if(!result[i].image.includes("https://")) {
            result[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${result[i].image}`
          }
        }
        data.data = result
        let totalPage = total[0]['COUNT(*)']
        let newLimit = (page+1)*limit
        if(totalPage - newLimit > 0) {
          data.page = page+1
        }
        if(Math.floor(totalPage/limit) > 0 && totalPage > limit) {
          data.totalPage = Math.floor(totalPage/limit)
        }
        return data
      }
    } catch (err) {
      console.log(err)
    }
  },
  listHots: async (limit, error) => {
    let sql = `SELECT * FROM recipe ORDER BY likes DESC LIMIT ${limit}`
    let result = await connection.sqlQuery(sql, error)
    for(let i = 0; i<result.length; i++) {
      if(!result[i].image.includes("https://")) {
        result[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${result[i].image}`
      }
    }
    let data = {
      data: result
    }
    return data
  },
  searchRecords: async (body, error) => {
    let searchItem = body.searchItem
    let category = body.category
    if (category === "dishName"){
      let sql = `INSERT INTO searchRecords SET ?`
      let args = {
        searchItem: searchItem.replace(' ',''),
        category: category
      }
      let result = await connection.sqlQuery2(sql,args,error)
      return result
    } else if(body.category = "ingredient") {
      let searchArr = []
      if(searchItem.length === 1){
        searchItem.push(category)
        searchArr.push(searchItem)
      } 
      else {
        searchItem.map((item) => searchArr.push([item, category]))
      }
      let sql = `INSERT INTO searchRecords (searchItem, category) VALUES ?`
      let result = await connection.sqlQuery2(sql,searchArr,error)
      return result
    } else {
      return util.error('Invalid Token')
    }
  },
  listHotKeywords: async (limit, error) => {
    let sql = `SELECT searchItem, category, COUNT(*) FROM searchRecords GROUP BY searchItem, category ORDER BY COUNT(*) DESC LIMIT ${limit}`
    let result = await connection.sqlQuery(sql, error)
    let data = {
      data: result
    }
    return data
  },
  deleteKeywords: async(period) => {
    let error = (error) => console.log(error)
    let sql = `DELETE FROM searchRecords WHERE createAt < (NOW() - INTERVAL ${period})`
    console.log(sql)
    let result = await connection.sqlQuery(sql, error)
    return result
  }
}