const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword, factory } = require("./utils/seed_db");
const Expense = require("../models/Expense");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("expenses puppeteer test", function () {
  before(async function () {
    this.timeout(30000);
    //await sleeper(5000)
    browser = await puppeteer.launch({headless: false, slowMo: 20});
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("Home page", function () {
    this.timeout(10000);
    it("Finds the login button", async () => {
      this.LoginButton = await page.waitForSelector("button ::-p-text(login)");
    });
    it("Gets to the login page", async () => {
      await this.LoginButton.click();
    });
  });
  describe("Login page", function () {
    this.timeout(10000);
    it("Resolves all the fields", async () => {
      this.email = await page.waitForSelector('input#email', {visible: true});
      this.password = await page.waitForSelector('input#password');
      this.loginSubmitButton = await page.waitForSelector("button#login-button");
    });
    it("Sends the login", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.loginSubmitButton.click();

      await page.waitForSelector(`p ::-p-text(login successful. Welcome ${testUser.name})`);
    });
  });
  describe("Dashboard page", function () {
    this.timeout(10000);
    it("Find the navigator button to add-expense page", async () => {
      this.addExpenseLinkButton = await page.waitForSelector("button#add-expense", {visible: true})
    });
    it("Hit button and gets to the add-expense page", async () => {
      await this.addExpenseLinkButton.click()
      await page.waitForSelector("div#edit-expense", {visible: true})
    });
  });
  describe("Add-expense page", function () {
    this.timeout(30000);
    it("Resolves the form's fields", async () => {
      this.title = await page.waitForSelector('input#title');
      this.amount = await page.waitForSelector('input#amount');
      this.card = await page.waitForSelector('input#card');
      this.description = await page.waitForSelector('textarea#description');
      this.category = await page.waitForSelector('select#category');
      this.submitExpenseButton = await page.waitForSelector("button#adding-expense")
    });
    it("Fill the form and hit submit", async () => {
      // Get an option's value randomly from the category's select element
      const randomOptionValue = await page.evaluate(() => {
        const select = document.querySelector('select#category');
        const randomIndex = Math.floor(Math.random() * select.options.length)
        return select.options[randomIndex].value;
      });

      fakeExpense = await factory.build("expense");
      await this.title.type(fakeExpense.title);
      await this.amount.type(`${fakeExpense.amount}`); // type() accept string not int
      await this.card.type(fakeExpense.card);
      await this.description.type(fakeExpense.description);
      await this.category.select(randomOptionValue);
      await this.submitExpenseButton.click();
    })
    it("Gets the success message", async () => {
      await page.waitForSelector('p#message ::-p-text(The expense entry was created.)', {visible: true});
    })
  });
});