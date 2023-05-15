// Require Cloudinary:
const cloudinary = require('cloudinary').v2;
// multer-storage-cloudinary creates storage bundles for cloudinary:
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// multer will manage file transfer on the web:
const multer = require('multer');

// Configure Cloudinary with key from .env file:
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

// Create storage:
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      allowed_formats: ['jpg', 'png', 'jpeg'],
      folder: 'imperial-archives' // The name of the folder in cloudinary
      // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
    }
  });
  
// export:
module.exports = multer({ storage });