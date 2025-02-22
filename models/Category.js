const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provide user'],
  },
  title: {
    type: String,
    required: [true, 'Provide title between 3 to 30 char length'],
    minlength: [3, 'Title min length is 3'],
    maxlength: [30, 'Title max length is 30'],
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Category', CategorySchema)