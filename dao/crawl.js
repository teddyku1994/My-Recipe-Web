const connection = require('../dao/promiseFunc')
const db = require('../db/dbConnect')
const util = require('../util/util')

module.exports = {

  renderCrawlResult: async (dishName, limit, page, error) => {
    try {
      let data = {}
      let offset = page*limit
      let sql = `SELECT * FROM recipe WHERE title LIKE '%${dishName}%' LIMIT ${limit} OFFSET ${offset}`
      let result = await connection.sqlQuery(sql, null, error)
      if(result.length === 0) return util.error('Invalid Search')
      let sql2 = `SELECT COUNT(*) FROM recipe WHERE title LIKE '%${dishName}%'`
      let total = await connection.sqlQuery(sql2, null, error)
      data.data = result
      let totalPage = total[0]['COUNT(*)']
      util.paging(limit, totalPage, page, data)
      return data
    } catch (err) {
      throw err
    }
  },
  renderCrawlResult2: async (ingredient, limit, page, error) => {
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
      let recipeIds = await connection.sqlQuery(sql, null, error)
      if(recipeIds.length === 0) return {error: 'Invalid Search'}
      let recipeIdsArr = recipeIds.map(item => item.recipe_id)
      let sql2 = `SELECT * FROM recipe WHERE id IN (?) LIMIT ? OFFSET ?`
      let recipesInfo = await connection.sqlQuery(sql2, [recipeIdsArr, limit, offset], error)
      let sql3 = `SELECT COUNT(*) FROM recipe WHERE id IN (?)`
      let total = await connection.sqlQuery(sql3, [recipeIdsArr], error)
      for(let i = 0; i<recipesInfo.length; i++) {
        if(!recipesInfo[i].image.includes("https://")) {
          recipesInfo[i].image = `https://d1lpqhjzd6rmjw.cloudfront.net${result[i].image}`
        }
      }
      data.data = recipesInfo
      let totalPage = total[0]['COUNT(*)']
      util.paging(limit, totalPage, page, data)
      return data
    } catch (err) {
      throw err
    }
  },
  recipeCrawlInsert: async (body) => {
    return new Promise((resolve, reject) => {
      let {steps, images, title, mainImg, ingredient, amount} =  body
      method = steps.map((items, idx) => [items, images[idx]])
      db.pool.getConnection((error, con) => {
        if(error) reject(error)
        con.beginTransaction((error) => {
          if(error) {
            reject(error)
            return con.rollback(() => con.release())
          } else {
            let sql = `INSERT INTO recipe(title, image) VALUES(?)`
            con.query(sql, [[title, mainImg]], (error, result) => {
              if(error) {
                reject(error)
                return con.rollback(() => con.release())
              }
              let recipeId = result.insertId
              let sql = `INSERT INTO ingredient (name, amount, recipe_id) VALUES (?)`
              con.query(sql, [[ingredient, amount, recipeId]], (error, result) => {
                if(error){
                  reject(error)
                  return con.rollback(() => con.release())
                }
                method.map(item => item.push(recipeId))
                let sql = `INSERT INTO method (step, image, recipe_id) VALUES ?`
                con.query(sql, [method], (error, result) => {
                  if(error){
                    reject(error)
                    return con.rollback(() => con.release())
                  }
                  con.commit((error) => {
                    if(error){
                      reject(error)
                      return con.rollback(() => con.release())
                    }
                    resolve({status:"Success"})
                  })
                })
              })
            })
          }
        })
      })
    })
  },
  checkDuplicate: async (mainImg, error) => {
    try {
      let sql = `SELECT image FROM recipe WHERE image = ?`
      let result = await connection.sqlQuery(sql, mainImg, error)
      return result
    } catch (err) {
      throw err
    }
  }
}