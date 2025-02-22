const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories')
const express = require('express')
const router = express.Router()

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').patch(updateCategory).delete(deleteCategory)

module.exports = router