const Expense = require('../models/Expense')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const DEFAULT_SORT = 'createdAt'
const PAGE_SIZE = 20;

const getAllExpenses = async (req, res) => {
  const { sort=DEFAULT_SORT, category='', search='', page=1, size=PAGE_SIZE } = req.query
  const limit = size;
  const skip = page*limit-limit;
  const searchTerm = search.trim()

  const filters = {
    userId: req.user.userId,
  }
  if(category)
    filters.category = category
  if(searchTerm)
    filters.title = { $regex: searchTerm, $options: 'i' }

  const expenses = await Expense.find(filters).populate('category', 'title').sort(sort).skip(skip).limit(limit)
  res.status( StatusCodes.OK ).json({ expenses, count: expenses.length, ...{category, searchTerm, sort, skip, limit} })
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