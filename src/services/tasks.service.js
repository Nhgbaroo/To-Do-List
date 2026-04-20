const mongoose = require('mongoose')
const Task = require('../models/task.model')
const CategoryValue = require('../models/categoryValue.model')
const { cloudinary } = require('../config/cloudinary.config')

// Tự động gán CategoryValue mặc định cho các Category chưa được chọn
const buildFinalCategoryIds = async (userId, categoryIds) => {
    let finalIds = []
    if (categoryIds) {
        finalIds = Array.isArray(categoryIds) ? [...categoryIds] : [categoryIds]
    }

    // Lấy danh sách các CategoryValue đã được người dùng chọn
    const providedCategoryValues = await CategoryValue.find({ _id: { $in: finalIds }, userId })
    const providedCategoryIdsSet = new Set(providedCategoryValues.map(val => val.categoryId.toString()))

    // Lấy danh sách các CategoryValue mặc định
    const defaultCategoryValues = await CategoryValue.find({ isDefault: true, userId })

    defaultCategoryValues.forEach(defaultVal => {
        const catId = defaultVal.categoryId.toString()
        // Nếu user CHƯA chọn bất kỳ giá trị nào thuộc Category này, thì tự động gán giá trị mặc định
        if (!providedCategoryIdsSet.has(catId)) {
            finalIds.push(defaultVal._id)
        }
    })

    return finalIds
}

// CREATE TASK
const createTask = async (userId, data, file) => {
    const { title, description, categoryIds, dueDate, isVital } = data

    // Xử lý ảnh nếu có (multer-storage-cloudinary)
    let imageUrl = null
    let imagePublicId = null
    if (file) {
        imageUrl = file.path
        imagePublicId = file.filename
    }

    // Cast isVital: form-data gửi string, JSON gửi boolean
    const isVitalFlag = isVital === 'true' || isVital === true

    const finalCategoryIds = await buildFinalCategoryIds(userId, categoryIds)

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

    // Lấy task hiện tại để kiểm tra ownership và ảnh cũ
    const existingTask = await Task.findOne({ _id: taskId, userId })
    if (!existingTask) {
        throw { status: 404, message: 'Task không tồn tại' }
    }

    // Cast isVital: form-data gửi string, JSON gửi boolean
    const isVitalFlag = isVital === 'true' || isVital === true

    const finalCategoryIds = await buildFinalCategoryIds(userId, categoryIds)

    const updateData = {
        title,
        description: description || null,
        categoryIds: finalCategoryIds,
        dueDate: dueDate || null,
        isVital: isVitalFlag
    }

    if (file) {
        // Xóa ảnh cũ trên Cloudinary trước khi gán ảnh mới
        if (existingTask.imagePublicId) {
            await cloudinary.uploader.destroy(existingTask.imagePublicId)
        }
        updateData.imageUrl = file.path
        updateData.imagePublicId = file.filename
    }

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { $set: updateData },
        { returnDocument: 'after', runValidators: true }
    )

    return updatedTask
}

// GET ALL TASKS
const getAllTasks = async (userId) => {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 })
    return tasks
}

// GET TASK BY ID
const getTaskById = async (userId, taskId) => {
    const task = await Task.findOne({ _id: taskId, userId })
    if (!task) {
        throw { status: 404, message: 'Task không tồn tại' }
    }
    return task
}

// GET TASKS BY STATUS
const getTasksByStatus = async (userId, status) => {
    const filter = { userId }

    if (mongoose.Types.ObjectId.isValid(status)) {
        filter.categoryIds = status
    } else {
        const statusValue = await CategoryValue.findOne({ slug: status, userId })
        if (statusValue) {
            filter.categoryIds = statusValue._id
        } else {
            return []
        }
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 })
    return tasks
}

// GET VITAL TASKS
const getVitalTasks = async (userId) => {
    const tasks = await Task.find({ userId, isVital: true }).sort({ createdAt: -1 })
    return tasks
}

const deleteTask = async (userId, taskId) => {
    const existingTask = await Task.findOne({ _id: taskId, userId })
    if (!existingTask) {
        throw { status: 404, message: 'Task không tồn tại' }
    }
    if (existingTask.imagePublicId) {
        await cloudinary.uploader.destroy(existingTask.imagePublicId)
    }
    await Task.deleteOne({ _id: taskId, userId })
}

module.exports = { createTask, updateTask, getAllTasks, getTasksByStatus, getVitalTasks, deleteTask, getTaskById }
