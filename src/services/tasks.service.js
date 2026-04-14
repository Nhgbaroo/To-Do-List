const Task = require('../models/task.model')
const CategoryValue = require('../models/categoryValue.model')
const { cloudinary } = require('../config/cloudinary.config')

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

    // Lấy danh sách các CategoryValue đã được người dùng chọn
    const providedCategoryValues = await CategoryValue.find({ _id: { $in: finalCategoryIds }, userId });
    const providedCategoryIdsSet = new Set(providedCategoryValues.map(val => val.categoryId.toString()));

    // Lấy danh sách các CategoryValue mặc định
    const defaultCategoryValues = await CategoryValue.find({ isDefault: true, userId });

    defaultCategoryValues.forEach(defaultVal => {
        const catId = defaultVal.categoryId.toString();
        // Nếu user CHƯA chọn bất kỳ giá trị nào thuộc Category này, thì tự động gán giá trị mặc định
        if (!providedCategoryIdsSet.has(catId)) {
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

// UPDATE TASK
const updateTask = async (userId, taskId, data, file) => {
    const { title, description, categoryIds, dueDate, isVital } = data

    // Lấy task hiện tại để kiểm tra ảnh cũ
    const existingTask = await Task.findOne({ _id: taskId, userId })
    if (!existingTask) {
        throw { status: 404, message: 'Task không tồn tại' }
    }

    // cast isVital string form-data to boolean
    const isVitalFlag = isVital === 'true' || isVital === true

    // Cấu trúc lại mảng categoryIds
    let finalCategoryIds = [];
    if (categoryIds) {
        finalCategoryIds = Array.isArray(categoryIds) ? [...categoryIds] : [categoryIds];
    }

    // Lấy danh sách các CategoryValue đã được người dùng chọn
    const providedCategoryValues = await CategoryValue.find({ _id: { $in: finalCategoryIds }, userId });
    const providedCategoryIdsSet = new Set(providedCategoryValues.map(val => val.categoryId.toString()));

    // Lấy danh sách các CategoryValue mặc định
    const defaultCategoryValues = await CategoryValue.find({ isDefault: true, userId });

    defaultCategoryValues.forEach(defaultVal => {
        const catId = defaultVal.categoryId.toString();
        // Nếu user CHƯA chọn bất kỳ giá trị nào thuộc Category này, thì tự động gán giá trị mặc định
        if (!providedCategoryIdsSet.has(catId)) {
            finalCategoryIds.push(defaultVal._id);
        }
    });

    const updateData = {
        title,
        description: description || null,
        categoryIds: finalCategoryIds,
        dueDate: dueDate || null,
        isVital: isVitalFlag
    };

    if (file) {
        updateData.imageUrl = file.path;
        updateData.imagePublicId = file.filename;

        // Xóa ảnh cũ trên Cloudinary nếu có
        if (existingTask.imagePublicId) {
            await cloudinary.uploader.destroy(existingTask.imagePublicId);
        }
    }

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { $set: updateData },
        { returnDocument: 'after' }
    )

    return updatedTask
}

module.exports = { createTask, updateTask }
