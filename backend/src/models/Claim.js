import mongoose from 'mongoose'

const claimSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderNumber: { type: String, required: true },
  itemIndex: { type: Number, required: true, min: 0 },
  itemName: { type: String, required: true },
  reason: { type: String, required: true, maxlength: 1000 },
  images: [{ type: String }],
  status: { type: String, enum: ['submitted', 'reviewing', 'approved', 'rejected', 'resolved'], default: 'submitted', index: true },
  adminNote: { type: String, default: '', maxlength: 1000 },
}, { timestamps: true })

claimSchema.index({ order: 1, itemIndex: 1 }, { unique: true })
export default mongoose.models.Claim || mongoose.model('Claim', claimSchema)
