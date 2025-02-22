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
    required: [true, 'Provide title between 3 to 50 char length'],
    minlength: [3, 'Title min length is 3'],
    maxlength: [50, 'Title max length is 50'],
  },
  description: {
    type: String,
    maxlength: 255
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    // required: [true, 'Provide category'],
    // type: String,
    // required: [true, 'Provide category of expense'],
    // enum: ['Groceries', 'Rent', 'Entertainment', 'Transportation', 'Health', 'Utilities', 'Bills', 'Subscriptions', 'Other']
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Expense', ExpenseSchema)