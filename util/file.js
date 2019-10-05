const multer = require('multer')
const path = require('path')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const cst = require('../util/const')

const s3 = new aws.S3({
  accessKeyId: cst.accessKeyId,
  secretAccessKey: cst.secretAccessKey,
  bucket: 'myrecipsebucket'
 });

const deleteS3File = async (filePath) => {
  try {
    let params = {Bucket: 'myrecipsebucket', Key: filePath}
    await s3.deleteObject(params).promise()
  } catch (err) {
    console.log(err)
  }
}

const uploadRecipe = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'myrecipsebucket',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
      cb(null, `recipes/${req.userId}/${Date.now()+file.originalname}`)
    }
  }),
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb )
  }
})
.fields([
  {name: 'mainImg', maxCount: 1},
  {name:'images', maxCount:20}
])

const uploadProfileImg = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'myrecipsebucket',
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
      cb(null, `profile/${req.body.id}/${Date.now()+file.originalname}`)
    }
  }),
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb )
  }
})
.fields([{name: 'profilePic', maxCount: 1}])

//Check File Type
function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null, true)
  } else {
    cb('Error: Images Only')
  }
}

module.exports = {
  uploadRecipe: uploadRecipe,
  uploadProfileImg: uploadProfileImg,
  deleteS3File: deleteS3File
}