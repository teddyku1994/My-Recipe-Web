require('dotenv').config();

module.exports={
  api_ver: '1.0',
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
}