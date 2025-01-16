require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authRouter = require('./routes/auth')
const expensesRouter = require('./routes/expenses')
const connectDB = require('./db/connect')
const authMiddleware = require('./middleware/authMiddleware')
// error handler
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');

app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/expenses', authMiddleware, expensesRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
