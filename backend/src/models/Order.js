import mongoose from 'mongoose'

const statusValues = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned']

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productId: String,
  name: { type: String, required: true },
  slug: String,
  image: String,
  price: { type: Number, required: true, min: 0 },
  purchasePrice: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: String,
  isCustom: { type: Boolean, default: false },
  customDetails: { type: mongoose.Schema.Types.Mixed },
}, { _id: false })

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: statusValues, required: true },
  note: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  firebaseUid: { type: String, default: '', index: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    province: { type: String, required: true, default: 'Punjab' },
    city: { type: String, required: true },
  },
  items: { type: [orderItemSchema], required: true, validate: (value) => value.length > 0 },
  paymentMethod: { type: String, enum: ['cod', 'easypaisa', 'jazzcash', 'bank'], default: 'cod' },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed', 'refunded'], default: 'unpaid' },
  paymentProof: { type: String, default: '' },
  paymentReviewNote: { type: String, default: '' },
  status: { type: String, enum: statusValues, default: 'pending', index: true },
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  notes: { type: String, default: '', maxlength: 1000 },
  statusHistory: [statusHistorySchema],
}, { timestamps: true })

orderSchema.pre('validate', async function assignOrderNumber() {
  if (this.orderNumber) return
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const random = Math.floor(1000 + Math.random() * 9000)
  this.orderNumber = `KMR-${date}-${random}`
})

export { statusValues }
export default mongoose.models.Order || mongoose.model('Order', orderSchema)
