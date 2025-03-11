const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WanderLust_DEV',
      allowedFormats : ["jpg","png","jpeg"] ,// supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  })

  module.exports = {
    cloudinary,
    storage
  }