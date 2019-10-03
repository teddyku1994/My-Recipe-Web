const connection = require('./promiseFunc')
const util = require('../util/util')
const db = require('../db/dbConnect')
const recipe = require('./recipe')

module.exports = {
  getInfo: async (userId, error) => {
    let sql = `SELECT * FROM user WHERE id = ?`
    let userData = await connection.sqlQuery(sql, userId, error)
    if(userData.length === 0) return util.error('Invalid userId')
    if(userData[0].image) {
      if(!userData[0].image.includes("https://")) {
        userData[0].image = `https://d1lpqhjzd6rmjw.cloudfront.net${userData[0].image}`
      }
    }
    let data = { data: userData }
    return data
  },
  update: async (userId, info, error) => {
    let sql
    if(info[1] === null) {
      sql = `UPDATE user SET name = '${info[0]}' WHERE id = ${userId}`
    } else {
      sql = `UPDATE user SET name = '${info[0]}', image = '${info[1]}' WHERE id = ${userId}`
    }
    let result = await connection.sqlQuery(sql, error)
    if(result.affectedRows === 1) {
      return {status:'Success'}
    } else {
      return result
    }
  },
  listRecipe: async (userId, error) => {
    let sql = 'SELECT * FROM recipe WHERE user_id = ?'
    let result = await connection.sqlQuery(sql, userId, error)
    if(result.length === 0) return util.error('No Result')
    let data = {data:result}
    return data
  },
  userRecipe: async (userId, recipeId, error) => {
    let sql = 'SELECT * FROM recipe WHERE id = ? AND user_id = ?'
    let checkExist = await connection.sqlQuery(sql, [recipeId, userId], error)
    let uerRecipe = await recipe.listDish(checkExist[0].id)
    return uerRecipe
  },
  createRecipe: (body, file, userId) => {
    let {mainImg, images} = file
    if(body.ingredient.length !== body.amount.length || body.steps.length !== images.length || !mainImg || !body.title || !body.ingredient || !body.steps) {
      return util.error('Invalid Token')
    }
    return new Promise((resolve, reject) => {
      let ingredient = body.ingredient.join(',')
      let amount = body.amount.join(',')
      let steps =  body.steps
      let method = []
      steps.map(items => method.push([items]))
      for(let i = 0; i < images.length; i++) {
        method[i].push(images[i].location.replace('https://myrecipsebucket.s3.amazonaws.com', ''))
      }
      db.pool.getConnection((error, con) => {
        con.beginTransaction((error) => {
          if(error) {
            reject("Database Query Error: "+error);
            return con.rollback(() => con.release())
          } else {
            let sql = `INSERT INTO recipe(title, image, user_id) VALUES('${body.title}', '${mainImg[0].location.replace('https://myrecipsebucket.s3.amazonaws.com', '')}', '${userId}')`
            con.query(sql, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              let recipeId = result.insertId
              console.log(recipeId)
              let sql = `INSERT INTO ingredient (name, amount, recipe_id) VALUES ('${ingredient}', '${amount}', '${recipeId}')`
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
  updateRecipe: async (body, file, userId) => {

    let image = body.image
    let mainImg
    if (file.mainImg) mainImg = file.mainImg[0].location.replace('https://myrecipsebucket.s3.amazonaws.com', '')
    if (file.images){
      for(let i = 0; i < file.images.length; i++) {
        let item = image.find((item) => item >= 0)
        let x = image[image.indexOf(item)].replace(item, file.images[i].location.replace('https://myrecipsebucket.s3.amazonaws.com', ''))
        image.splice(image.indexOf(item) ,1 ,x)
      }
    }
    return new Promise((resolve, reject) => {
      let ingredient = body.ingredient.join(',')
      let amount = body.amount.join(',')
      let steps =  body.steps
      let method = []
      steps.map(items => method.push([items]))
      for(let i = 0; i < image.length; i++) {
        method[i].push(image[i])
      }
      console.log(method)
      db.pool.getConnection((error, con) => {
        con.beginTransaction((error) => {
          if(error) {
            reject("Database Query Error: "+error);
            return con.rollback(() => con.release())
          } else {
            let sql 
            if(mainImg){
              sql = `UPDATE recipe SET title ='${body.title}', image = '${mainImg}' WHERE id = ${body.recipeId} AND user_id = ${userId}`
            } else {
              sql = `UPDATE recipe SET title ='${body.title}' WHERE id = ${body.recipeId} AND user_id = ${userId}`
            }
            console.log(sql)
            con.query(sql, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                con.rollback(() => con.release())
                return "error"
              }
              console.log("ok")
            })
            let sql2 = `UPDATE ingredient SET name ='${ingredient}', amount = '${amount}' WHERE recipe_id = ${body.recipeId}`
            con.query(sql2, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              console.log("ok")
            })
            let sql3 = `DELETE FROM method WHERE recipe_id = ${body.recipeId}`
            con.query(sql3, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              console.log("ok")
            })
            let methods = method.map(item => item.push(body.recipeId))
            let sql4 = `INSERT INTO method (step, image, recipe_id) VALUES ?`
            con.query(sql4, [method], (error, result) => {
              if(error) {
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
          }
        })
      })
    })
  },
  deleteRecipe: async (body, userId, error) => {
    let sql = 'SELECT * FROM recipe WHERE id = ? AND user_id = ?'
    let result = await connection.sqlQuery(sql, [body.recipeId, userId], error)
    if (!result) return util.error('Invalid Token')
    let sql2 = 'DELETE FROM recipe WHERE id = ?'
    await connection.sqlQuery(sql2, body.recipeId, error)
    return({status:"Success"})
  }
}