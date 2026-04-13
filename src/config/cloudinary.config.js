const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình storage cho Multer kết nối tới Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => {
      if (file.fieldname === 'avatar') {
        return 'todo-list/users';
      }
      return 'todo-list/tasks';
    },
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const uploadCloud = multer({ storage });

module.exports = { cloudinary, uploadCloud };
