const Task = require('../models/task.model')
const CategoryValue = require('../models/categoryValue.model')

// CREATE TASK
const createTask = async (userId, data, file) => {
    const { title, description, categoryIds, dueDate, isVital } = data

    // Xử lý ảnh nếu có theo uploadCloud (multer-storage-cloudinary)
    let imageUrl = null
    let imagePublicId = null

    if (file) {
        imageUrl = file.path
        imagePublicId = file.filename
    }

    // cast isVital string form-data to boolean
    const isVitalFlag = isVital === 'true' || isVital === true

    // Cấu trúc lại mảng categoryIds
    let finalCategoryIds = [];
    if (categoryIds) {
        finalCategoryIds = Array.isArray(categoryIds) ? [...categoryIds] : [categoryIds];
    }

    // Quét tất cả các CategoryValue mà đã set isDefault: true gán vào tasks
    const defaultCategoryValues = await CategoryValue.find({ isDefault: true, userId });

    defaultCategoryValues.forEach(defaultVal => {
        const valId = defaultVal._id.toString();
        // Kiểm tra xem frontend có tự truyền ID này vào chưa, chưa thì tự fill
        const isExists = finalCategoryIds.some(id => id.toString() === valId);
        if (!isExists) {
            finalCategoryIds.push(defaultVal._id);
        }
    });

    const newTask = await Task.create({
        userId,
        title,
        description: description || null,
        categoryIds: finalCategoryIds,
        dueDate: dueDate || null,
        isVital: isVitalFlag,
        imageUrl,
        imagePublicId
    })

    return newTask
}

module.exports = { createTask }
