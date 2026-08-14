import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  recipientRole: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer', index: true },
  title: { type: String, required: true, maxlength: 160 },
  message: { type: String, required: true, maxlength: 500 },
  type: { type: String, enum: ['order', 'payment', 'inventory', 'claim', 'system'], default: 'system' },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true })

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
