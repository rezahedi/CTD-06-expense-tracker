const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provide user'],
  },
  amount: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    maxlength: 50,
  },
  description: {
    type: String,
    maxlength: 255
  },
  category: {
    type: String,
    required: [true, 'Provide category of expense'],
    enum: ['Groceries', 'Rent', 'Entertainment', 'Transportation', 'Health', 'Utilities', 'Bills', 'Subscriptions', 'Other']
  },
  createdAt: {
    type: Date,
    requiored: true,
    default: Date.now,
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Expense', ExpenseSchema)