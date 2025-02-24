const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')

const getCategories = async (req, res) => {
  const categories = await Category.aggregate([
    {
      // Always filter by logged in userId
      $match: { userId: req.user.userId }
    },
    {
      $lookup: {
        from: "expenses", // Reference to the expenses collection
        localField: "_id",
        foreignField: "category",
        as: 'expenses'
      }
    },
    {
      $addFields: {
        expenses: { $size: '$expenses'} // Count number of expenses
      }
    },
    {
      $sort: { title: 1 } // Sort by title
    }
  ])
  // const categories = await Category.find({ userId: req.user.userId }).populate('userId', 'name').sort('title')
  res.status( StatusCodes.OK ).json({ categories, count: categories.length })
}

const createCategory = async (req, res) => {
  const userId = req.user.userId

  const category = await Category.create(
    {
      ...req.body,
      userId
    }
  )
  res.status( StatusCodes.CREATED ).json({ category })
}

const updateCategory = async (req, res) => {
  const {
    body: { title },
    user: { userId },
    params: { id: categoryId },
  } = req;

  const category = await Category.findByIdAndUpdate(
    {
      _id: categoryId,
      userId
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  if ( !category ) {
    throw new NotFoundError(`No category with id ${categoryId}`)
  }

  res.status( StatusCodes.OK ).json({ category })
}

const deleteCategory = async (req, res) => {
  const userId = req.user.userId
  const categoryId = req.params.id

  const category = await Category.findByIdAndDelete(
    {
      _id: categoryId,
      userId
    }
  )

  if ( !category ) {
    throw new NotFoundError(`No category with id ${categoryId}`)
  }

  res.status( StatusCodes.OK ).json({msg: 'Deleted'})
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}