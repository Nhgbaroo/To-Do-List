const multer = require('multer')
const { uploadCloud } = require('../config/cloudinary.config');

const uploadSingleImage = (fieldName) => {
    return (req, res, next) => {
        const upload = uploadCloud.single(fieldName);

        upload(req, res, function (err) {
            if (err) {
                if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: 'Kích thước ảnh không được vượt quá 10MB'
                    })
                }
                console.error('Multer error:', err);
                return res.status(400).json({
                    message: 'Thông tin file ảnh không hợp lệ (sai tên Key hoặc định dạng).',
                    error: err.message
                });
            }
            next();
        });
    };
};

module.exports = { uploadSingleImage };
