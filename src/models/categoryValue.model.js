const mongoose = require('mongoose')

const categoryValueSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    color: { type: String, default: null },
    order: { type: Number, default: 0 },
    isSystem: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
)

const CategoryValue = mongoose.model('CategoryValue', categoryValueSchema)

module.exports = CategoryValue
