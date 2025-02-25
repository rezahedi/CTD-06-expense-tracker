const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories')
const express = require('express')
const router = express.Router()

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategory).patch(updateCategory).delete(deleteCategory)

module.exports = router