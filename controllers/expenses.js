const getAllExpenses = async (req, res) => {
  res.send('get all')
}

const getExpense = async (req, res) => {
  res.send('get one')
}

const createExpense = async (req, res) => {
  res.send('create')
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