const Expense = require('../models/Expense')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.userId }).populate('userId', 'name').sort('createdAt')
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
  }).populate('userId', 'name')

  if ( !expense ) {
    throw new NotFoundError(`No expense with id ${expenseId}`)
  }

  res.status( StatusCodes.OK ).json({ expense })
}

const createExpense = async (req, res) => {
  req.body.userId = req.user.userId
  const expense = await Expense.create( req.body )
  res.status( StatusCodes.CREATED ).json({ expense })
}

const updateExpense = async (req, res) => {
  const {
    body: { amount, title, description, category },
    user: { userId },
    params: { id: expenseId },
  } = req;

  if ( amount === undefined ) {
    throw new BadRequestError('Amount field is required')
  }

  if ( title !== undefined && title === '' ) {
    throw new BadRequestError('Title field is optional but cannot be empty')
  }

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
  res.send('create')
}

module.exports = {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
}