import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, default: '', maxlength: 500 },
  image: { type: String, default: '' },
  label: { type: String, default: '', maxlength: 20 },
  sections: [{ type: String, enum: ['men', 'women', 'accessories'] }],
  subcategories: [{ type: String, trim: true }],
  subcategoryBadges: { type: mongoose.Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model('Category', categorySchema)
