const Expense = require('../models/Expense')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const DEFAULT_SORT = 'createdAt'

const getAllExpenses = async (req, res) => {
  const { sort=DEFAULT_SORT, category='' } = req.query

  const filters = {
    userId: req.user.userId,
  }
  if(category)
    filters.category = category

  const expenses = await Expense.find(filters).populate('category', 'title').sort(sort)
  res.status( StatusCodes.OK ).json({ expenses, count: expenses.length })
}

const getExpense = async (req, res) => {
  // const {user: {userId}, params:{id: expenseId}} = req
  // Below lines are more readable than above commented line
  const userId = req.user.userId
  const expenseId = req.params.id

  const expense = await Expense.findOne({
    userId,
    _id: expenseId
  }).populate('category', 'title')

  if ( !expense ) {
    throw new NotFoundError(`No expense with id ${expenseId}`)
  }

  res.status( StatusCodes.OK ).json({ expense })
}

const createExpense = async (req, res) => {
  const userId = req.user.userId

  const expense = await Expense.create(
    {
      ...req.body,
      userId
    }
  )
  res.status( StatusCodes.CREATED ).json({ expense })
}

const updateExpense = async (req, res) => {
  const {
    body: { amount },
    user: { userId },
    params: { id: expenseId },
  } = req;

  // TODO: Sometimes user need to update anything except the `amount`
  if ( amount === undefined ) {
    throw new BadRequestError('Amount field is required')
  }

  // Unset category if undefined
  if( req.body.category === undefined )
    req.body.$unset = {category: 1}

  const expense = await Expense.findByIdAndUpdate(
    {
      _id: expenseId,
      userId
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  if ( !expense ) {
    throw new NotFoundError(`No expense with id ${expenseId}`)
  }

  res.status( StatusCodes.OK ).json({ expense })
}

const deleteExpense = async (req, res) => {
  const userId = req.user.userId
  const expenseId = req.params.id

  const expense = await Expense.findByIdAndDelete(
    {
      _id: expenseId,
      userId
    }
  )

  if ( !expense ) {
    throw new NotFoundError(`No expense with id ${expenseId}`)
  }

  res.status( StatusCodes.OK ).json({msg: 'Deleted'})
}

module.exports = {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
}