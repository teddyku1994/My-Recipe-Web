const connection = require('../dao/promiseFunc')
const mysql = require('../db/dbConnect')

module.exports = {

  crawlResult: async (dishName, limit, page, error) => {
    let data = {}
    let offset = page*limit
    let sql = `SELECT * FROM recipe WHERE title LIKE '%${dishName}%' LIMIT ${limit} OFFSET ${offset}`
    let result = await connection.sqlQuery(sql, error)
    if(result.length === 0) return {error: 'Invalid Search'}
    let sql2 = `SELECT COUNT(*) FROM recipe WHERE title LIKE '%${dishName}%'`
    let total = await connection.sqlQuery(sql2, error)
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
  },
  crawlResult2: async (ingredient, limit, page, error) => {
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
    if(result.length === 0) return {error: 'Invalid Search'}
    let ids = await result.map((item) => {
      let ids = ''
      return ids += item.recipe_id
    })
    let sql2 = `SELECT * FROM recipe WHERE id IN (${ids.join(',')}) LIMIT ${limit} OFFSET ${offset}`
    let newResult = await connection.sqlQuery(sql2, error)
    let sql3 = `SELECT COUNT(*) FROM recipe WHERE id IN (${ids.join(',')})`
    let total = await connection.sqlQuery(sql3, error)
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
  },
  recipeCrawl: async (body) => {
    return new Promise((resolve, reject) => {
      console.log(body)
      let steps =  body.steps
      let images = body.images
      let method = []
      steps.map(items => method.push([items]))
      for(let i = 0; i < images.length; i++) {
        method[i].push(images[i])
      }
      mysql.con.getConnection((error, con) => {
        con.beginTransaction((error) => {
          if(error) {
            reject("Database Query Error: "+error);
            return con.rollback(() => con.release())
          } else {
            let sql = `INSERT INTO recipe(title, image) VALUES('${body.title}', '${body.mainImg}')`
            con.query(sql, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              let recipeId = result.insertId
              console.log(recipeId)
              let sql = `INSERT INTO ingredient (name, amount, recipe_id) VALUES ('${body.ingredient}', '${body.amount}', '${recipeId}')`
              con.query(sql, (error, result) => {
                if(error){
                  reject("Database Query Error: "+error);
                  return con.rollback(() => con.release())
                }
                let methods = method.map(item => item.push(recipeId))
                let sql = `INSERT INTO method (step, image, recipe_id) VALUES ?`
                con.query(sql, [method], (error, result) => {
                  if(error){
                    reject("Database Query Error: "+error);
                    return con.rollback(() => con.release())
                  }
                  con.commit((error) => {
                    if(error){
                      reject("Database Query Error: "+error)
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
    let sql = `SELECT image FROM recipe WHERE image = '${mainImg}'`
    let result = await connection.sqlQuery(sql, error)
    return result
  }
}