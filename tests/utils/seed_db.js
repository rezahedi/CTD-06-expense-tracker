const Expense = require("../../models/Expense");
const Category = require("../../models/Category");
const User = require("../../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();
const CATEGORIES = ["Groceries", "Utilities", "Bills", "Entertainment", "Shopping", "Restaurant & Bars"];

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);
factory.define("expense", Expense, {
  amount: () => faker.finance.amount({ min: 1, max: 5000, dec: 0 }),
  title: () => faker.finance.transactionDescription().substring(0, 40),
  description: () => faker.finance.transactionDescription().substring(0, 255),
  card: () => faker.finance.creditCardIssuer(),
});
factory.define("category", Category, {
  title: () => getNextCategory(),
  budget: () => faker.finance.amount({ min: 50, max: 2000, dec: 0 }),
});
factory.define("user", User, {
  name: () => faker.person.firstName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;
  let testCategory = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    await Expense.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    testUser = await factory.create("user", { password: testUserPassword });
    testCategory = await factory.createMany("category", CATEGORIES.length, { userId: testUser._id });
    await factory.createMany("expense", 2, { userId: testUser._id, category: () => testCategory[Math.floor(Math.random() * testCategory.length)]._id });
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }
  return testUser;
};

const getNextCategory = (() => {
  let index = 0;
  return () => {
    if (index >= CATEGORIES.length) index = 0; // Reset index if it exceeds the list
    return CATEGORIES[index++];
  };
})();

module.exports = { testUserPassword, factory, seed_db };