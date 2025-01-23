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
// Security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 60_000, // 6 min
  max: 100, // limit each IP to 100 request per windowMs
}))

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/', (req, res) => {
  res.send('<h1>Expense API</h1><p><a href="/api-docs">The API Documentation</a></p>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

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
