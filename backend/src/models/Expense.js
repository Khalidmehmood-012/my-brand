import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, enum: ['marketing', 'shipping', 'operations', 'salary', 'rent', 'utilities', 'other'], default: 'other', index: true },
  amount: { type: Number, required: true, min: 0 },
  expenseDate: { type: Date, required: true, default: Date.now, index: true },
  note: { type: String, default: '', maxlength: 1000 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema)
