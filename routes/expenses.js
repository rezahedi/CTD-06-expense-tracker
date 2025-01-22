const {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenses')
const express = require('express')
const router = express.Router()

router.route('/').get(getAllExpenses).post(createExpense)
router.route('/:id').get(getExpense).patch(updateExpense).delete(deleteExpense)

module.exports = router