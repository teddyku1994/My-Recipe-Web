const connection = require('./promiseFunc')
const util = require('../util/util')

module.exports = {
  insert: async (userId, recipeId, error) => {
    let sql = `INSERT INTO favorite (user_id, recipe_id) VALUES (${userId},${recipeId})`
    let result = await connection.sqlQuery(sql, error)
    return result
  },
  delete: async(userId, recipeId, error) => {
    let sql = `DELETE FROM favorite WHERE user_id = ${userId} AND recipe_id = ${recipeId}`
    let result = await connection.sqlQuery(sql, error)
    return result
  },
  list: async (userId, limit, page, error) => {
    let data= {}
    let offset = page*limit
    let sql = `
    SELECT favorite.*, recipe.*
    FROM favorite
    JOIN recipe
    ON favorite.recipe_id = recipe.id
    WHERE favorite.user_id = ${userId}
    LIMIT ${limit} OFFSET ${offset}
    `
    let favList = await connection.sqlQuery(sql, error)
    data.data = favList
    if(favList.length === 0) return util.error('Invalid userId')
    let sql2 = `SELECT COUNT(*) FROM favorite WHERE user_id = ${userId}`
    let total = await connection.sqlQuery(sql2, error)
    let totalPage = total[0]['COUNT(*)']
    util.paging(limit, totalPage, page, data)
    // let newLimit = (page+1)*limit
    // if(totalPage - newLimit > 0) {
    //   data.page = page+1
    // }
    // if(Math.floor(totalPage/limit) > 0 && totalPage > limit) {
    //   data.totalPage = Math.floor(totalPage/limit)
    // }
    // console.log(data)
    return data
  },
  check: async(userId, recipeId, error) => {
    let sql = `SELECT * FROM favorite WHERE user_id = ${userId} AND recipe_id = ${recipeId}`
    let result = await connection.sqlQuery(sql, error)
    return result
  }
}