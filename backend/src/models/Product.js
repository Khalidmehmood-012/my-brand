import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  legacyId: { type: String, index: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, default: '', maxlength: 3000 },
  price: { type: Number, required: true, min: 0 },
  purchasePrice: { type: Number, min: 0, default: 0, select: false },
  originalPrice: { type: Number, min: 0, default: 0 },
  isOnSale: { type: Boolean, default: false, index: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true, lowercase: true, index: true },
  subcategory: { type: String, default: '' },
  gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex', index: true },
  badge: { type: String, default: '' },
  sizes: [{ type: String }],
  stock: { type: Number, min: 0, default: 100 },
  isFeatured: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', category: 'text', subcategory: 'text' })

export default mongoose.models.Product || mongoose.model('Product', productSchema)
