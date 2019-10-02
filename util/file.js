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

 const uploadRecipe = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'myrecipsebucket',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `recipes/${req.body.recipeId}/${Date.now()+file.originalname}`)
    }
  }),
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb );
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
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `profile/${req.body.id}/${Date.now()+file.originalname}`)
    }
  }),
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb );
  }
})
.fields([{name: 'profilePic', maxCount: 1}]);


// const deleteS3Obj = (filename) => {
//   let params = {
//     Bucket: 'myrecipsebucket',
//     Key: filename
//   };
//   s3.deleteObject(params, (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('ok')
//     }
//   });
// }


// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
  
// // Init Upload Multer
// const upload = multer({
//   storage : storage,
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// })
// .fields([
//   {name: 'mainImg', maxCount: 1},
//   {name:'images', maxCount:20},
//   {name: 'profilePic', maxCount: 1}
// ])

//Check File Type
function checkFileType(file, cb){
  // Check file Type
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only');
  }
}

module.exports = {
  uploadRecipe: uploadRecipe,
  uploadProfileImg: uploadProfileImg
  // deleteS3Obj: deleteS3Obj
}