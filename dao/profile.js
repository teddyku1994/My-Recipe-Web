const db = require('../db/dbConnect')
const connection = require('./promiseFunc')
const recipe = require('./recipe')
const util = require('../util/util')
const file =  require('../util/file')

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
    let result
    if(!info[1]) {
      sql = 'UPDATE user SET name = ? WHERE id = ?'
      result = await connection.sqlQuery(sql, [info[0], userId], error)
    } else {
      sql = 'SELECT image FROM user WHERE id = ?'
      let oldDp = await connection.sqlQuery(sql, userId, error)
      let oldDpPath = oldDp[0].image.replace('https://myrecipsebucket.s3.amazonaws.com', '')
      oldDpPath = oldDpPath.substr(1, oldDpPath.length - 1)
      await file.deleteS3File(oldDpPath)
      sql = 'UPDATE user SET name = ?, image = ? WHERE id = ?'
      result = await connection.sqlQuery(sql, [info[0], info[1], userId], error)
    }
    if(result.affectedRows === 1) {
      return {status:'Success'}
    } else {
      return util.error('Invalid Token')
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
      mainImg[0].location.includes('https://myrecipsebucket.s3.amazonaws.com') ?
      mainImg = mainImg[0].location.replace('https://myrecipsebucket.s3.amazonaws.com', '')
      : mainImg = mainImg[0].location.replace('https://myrecipsebucket.s3.us-east-2.amazonaws.com', '')
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
            let recipeData = {
              title: body.title,
              image: mainImg,
              user_id: userId
            }
            let sql = 'INSERT INTO recipe SET ?'
            con.query(sql, recipeData, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              let recipeId = result.insertId
              let sql = 'INSERT INTO ingredient SET ?'
              let ingredientData = {
                name: ingredient,
                amount: amount,
                recipe_id: recipeId
              }
              con.query(sql, ingredientData, (error, result) => {
                if(error){
                  reject("Database Query Error: "+error);
                  return con.rollback(() => con.release())
                }
                method.map(item => item.push(recipeId))
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
  updateRecipe: (body, file, userId) => {
    let {image} = body
    let mainImg
    if (file.mainImg) {
      file.mainImg[0].location.includes('https://myrecipsebucket.s3.amazonaws.com') ?
      mainImg = file.mainImg[0].location.replace('https://myrecipsebucket.s3.amazonaws.com', '')
      : mainImg = file.mainImg[0].location.replace('https://myrecipsebucket.s3.us-east-2.amazonaws.com', '')
    }
    if (file.images){
      for(let i = 0; i < file.images.length; i++) {
        let item = image.find((item) => item >= 0)
        let imageURL = image[image.indexOf(item)].replace(item, file.images[i].location.replace('https://myrecipsebucket.s3.amazonaws.com', ''))
        console.log("imageURL", imageURL)
        image.splice(image.indexOf(item) ,1 ,imageURL)
      }
    }
    return new Promise((resolve, reject) => {
      let ingredient = body.ingredient.join(',')
      let amount = body.amount.join(',')
      let steps =  body.steps
      let method = []
      steps.map(items => method.push([items]))
      for(let i = 0; i < image.length; i++) {
        if(image[i].includes('https://d1lpqhjzd6rmjw.cloudfront.net')) {
          method[i].push(image[i].replace('https://d1lpqhjzd6rmjw.cloudfront.net', ''))
        } else if (image[i].includes('https://myrecipsebucket.s3.us-east-2.amazonaws.com')) {
        method[i].push(image[i].replace('https://myrecipsebucket.s3.us-east-2.amazonaws.com', ''))
        } else {
          method[i].push(image[i])
        }
      }
      db.pool.getConnection((error, con) => {
        con.beginTransaction((error) => {
          if(error) {
            reject("Database Query Error: "+error);
            return con.rollback(() => con.release())
          } else {
            let sql
            let mainImgData
            if(mainImg){
              mainImgData = [body.title, mainImg, body.recipeId, userId]
              sql = 'UPDATE recipe SET title =?, image = ? WHERE id = ? AND user_id = ?'
            } else {
              mainImgData = [body.title, body.recipeId, userId]
              sql = 'UPDATE recipe SET title = ? WHERE id = ? AND user_id = ?'
            }
            con.query(sql, mainImgData, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                con.rollback(() => con.release())
                return "error"
              }
              console.log("ok1")
            })
            let sql2 = 'UPDATE ingredient SET name = ?, amount = ? WHERE recipe_id = ?'
            con.query(sql2, [ingredient, amount, body.recipeId], (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              console.log("ok2")
            })
            let sql3 = 'DELETE FROM method WHERE recipe_id = ?'
            con.query(sql3, body.recipeId, (error, result) => {
              if(error) {
                reject("Database Query Error: "+error);
                return con.rollback(() => con.release())
              }
              console.log("ok3")
            })
            method.map(item => item.push(body.recipeId))
            console.log(method)
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
  delPrevRecipeData: async (body, files, userId, error) => {
    try {
      if(files.mainImg) {
        let sql = 'SELECT * FROM recipe WHERE id = ? AND user_id = ?'
        let recipeData = await connection.sqlQuery(sql, [body.recipeId, userId], error)
        let mainImg = recipeData[0].image
        let mainImageURL = mainImg.substr(1, mainImg.length - 1)
        await file.deleteS3File(mainImageURL)
      }
      let sql2 = 'SELECT image FROM method WHERE recipe_id = ?'
      let methodImg = await connection.sqlQuery(sql2, body.recipeId, error)
      methodImg = methodImg.map(images => images.image)
      let newImgArr = body.image.map((image) => image.replace('https://d1lpqhjzd6rmjw.cloudfront.net', ''))
      for(let i = 0; i < methodImg.length; i++) {
        if(newImgArr.indexOf(methodImg[i]) === -1) {
          let imageURL = methodImg[i].substr(1, methodImg[i].length - 1)
          console.log("imageURL",imageURL)
          await file.deleteS3File(imageURL)
        }
      }
    } catch (err) {
      console.log(err)
      return util.error("Invalid Token")
    }
  },
  deleteRecipe: async (body, userId, error) => {
    let sql = 'SELECT * FROM recipe WHERE id = ? AND user_id = ?'
    let result = await connection.sqlQuery(sql, [body.recipeId, userId], error)
    if (!result) return util.error('Invalid Token')
    let sql2 = 'SELECT recipe.image AS mainImg, method.image  FROM recipe LEFT JOIN method ON recipe.id = method.recipe_id WHERE recipe.id = ?'
    let recipeImages = await connection.sqlQuery(sql2, body.recipeId, error)
    let mainImageURL = recipeImages[0].mainImg.substr(1, recipeImages[0].mainImg.length - 1)
    console.log(mainImageURL)
    await file.deleteS3File(mainImageURL)
    let imagesURL = recipeImages.map(images => images.image)
    for(let i = 0; i < imagesURL.length; i++) {
      let imageURL = imagesURL[i].substr(1, imagesURL[i].length - 1)
      await file.deleteS3File(imageURL)
    }
    let sql3 = 'DELETE FROM recipe WHERE id = ?'
    await connection.sqlQuery(sql3, body.recipeId, error)
    return({status:"Success"})
  }
}

// {
  // "Version": "2012-10-17",
  // "Statement": [
  //     {
  //         "Sid": "AddCannedAcl",
  //         "Effect": "Allow",
  //         "Principal": {
  //             "AWS": "arn:aws:iam::430369962406:user/appworks"
  //         },
  //         "Action": [
  //             "s3:PutObject",
  //             "s3:PutObjectAcl",
  //             "s3:DeleteObject"
  //         ],
  //         "Resource": "arn:aws:s3:::myrecipsebucket/*",
  //         "Condition": {
  //             "StringEquals": {
  //                 "s3:x-amz-acl": "public-read"
  //             }
  //         }
  //     }
