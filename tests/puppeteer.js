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
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page login button", async () => {
      this.LoginButton = await page.waitForSelector("button ::-p-text(login)");
    });
    it("gets to the login page", async () => {
      await this.LoginButton.click();
      // await page.waitForNavigation();
      const email = await page.waitForSelector('input#email');
    });
  });
  describe("login page test", function () {
    this.timeout(10000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input#email');
      this.password = await page.waitForSelector('input#password');
      this.loginSubmitButton = await page.waitForSelector("button#login-button");
    });
    it("sends the login", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.loginSubmitButton.click();

      await page.waitForSelector(`p ::-p-text(login successful. Welcome ${testUser.name})`);
    });
  });
  describe("Add expense test 1", function () {
    this.timeout(10000);
    it("find the add expense link button", async () => {
      this.addExpenseLinkButton = await page.waitForSelector("button#add-expense", {visible: true})
    });
    it("Hit button and gets to the add expense page", async () => {
      // this.addExpenseDiv = await page.waitForSelector("div#edit-expense")
      await this.addExpenseLinkButton.click()
    });
  });
  describe("Add expense test 2", function () {
    this.timeout(30000);
    it("resolves all the fields in add expense page", async () => {
      await page.waitForSelector("div#edit-expense", {visible: true})
      this.title = await page.waitForSelector('input#title');
      this.amount = await page.waitForSelector('input#amount');
      this.card = await page.waitForSelector('input#card');
      this.description = await page.waitForSelector('textarea#description');
      this.category = await page.waitForSelector('select#category');
      this.submitExpenseButton = await page.waitForSelector("button#adding-expense")
    });
    it("add expense's detail and submit", async () => {
      fakeExpense = await factory.build("expense");
      console.log(fakeExpense);

      const firstOptionValue = await page.evaluate(() => {
        const select = document.querySelector('select#category');
        return select.options[1].value; // Get the first option's value
      });
      console.log('firstOptionValue', firstOptionValue)

      await this.title.type('in test hast');
      await this.amount.type(`${fakeExpense.amount}`); // type() accept string not int
      await this.card.type(fakeExpense.card);
      await this.description.type(fakeExpense.description);
      await this.category.select(firstOptionValue);
      await this.submitExpenseButton.click();
      await page.waitForSelector('p#message ::-p-text(The expense entry was created.)', {visible: true});
      // const message = await page.evaluate(() => {
      //   return document.querySelector('p#message').textContent;
      // })
      // console.log('message', message)
    })
  });
});