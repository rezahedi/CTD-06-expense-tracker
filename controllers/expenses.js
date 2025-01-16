const Expense = require('../models/Expense')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllExpenses = async (req, res) => {
  res.send('get all')
}

const getExpense = async (req, res) => {
  res.send('get one')
}

const createExpense = async (req, res) => {
  req.body.userId = req.user.userId
  const expense = await Expense.create( req.body )
  res.status( StatusCodes.CREATED ).json({ expense })
}

const updateExpense = async (req, res) => {
  res.send('create')
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