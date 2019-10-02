const connection = require('./promiseFunc')
const util = require('../util/util')

module.exports = {
  insert: async (userId, recipeId, error) => {
    let sql = 'INSERT INTO favorite (user_id, recipe_id) VALUES (?)'
    let result = await connection.sqlQuery(sql, [userId,recipeId], error)
    return result
  },
  delete: async(userId, recipeId, error) => {
    let sql = 'DELETE FROM favorite WHERE user_id = ? AND recipe_id = ?'
    let result = await connection.sqlQuery(sql, [userId, recipeId], error)
    return result
  },
  list: async (userId, limit, page, error) => {
    if(isNaN(page) || isNaN(limit)) return util.error("Invalid Token")
    let data= {}
    let offset = page*limit
    let sql = `
    SELECT favorite.*, recipe.*
    FROM favorite
    JOIN recipe
    ON favorite.recipe_id = recipe.id
    WHERE favorite.user_id = ?
    LIMIT ? OFFSET ?
    `
    let params = [userId, limit, offset]
    let favList = await connection.sqlQuery(sql, params, error)
    data.data = favList
    if(favList.length === 0) return util.error('Invalid userId')
    let sql2 = 'SELECT COUNT(*) FROM favorite WHERE user_id = ?'
    let total = await connection.sqlQuery(sql2, userId, error)
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
  checkExist: async(userId, recipeId, error) => {
    let sql = 'SELECT * FROM favorite WHERE user_id = ? AND recipe_id = ?'
    let result = await connection.sqlQuery(sql, [userId, recipeId], error)
    return result
  }
}