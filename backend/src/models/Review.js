import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  itemIndex: { type: Number, required: true, min: 0 },
  customerName: { type: String, required: true, maxlength: 120 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, minlength: 5, maxlength: 1000 },
  isVerifiedPurchase: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true, index: true },
}, { timestamps: true })

reviewSchema.index({ order: 1, itemIndex: 1, user: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
