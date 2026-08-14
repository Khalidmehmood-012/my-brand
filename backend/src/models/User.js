import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, select: false },
  firebaseUid: { type: String, sparse: true, unique: true, index: true },
  photo: String,
  phone: String,
  addresses: [{
    label: { type: String, default: 'Home', maxlength: 50 },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    province: { type: String, required: true, default: 'Punjab' },
    city: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  }],
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer', index: true },
  isActive: { type: Boolean, default: true },
  totalOrders: { type: Number, default: 0, min: 0 },
  totalSpent: { type: Number, default: 0, min: 0 },
  lastLoginAt: Date,
}, { timestamps: true })

userSchema.set('toJSON', {
  transform(_document, object) {
    delete object.passwordHash
    return object
  },
})

export default mongoose.models.User || mongoose.model('User', userSchema)
