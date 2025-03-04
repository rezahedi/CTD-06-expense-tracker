const { app } = require("../app");
const get_chai = require("./utils/get_chai");

describe("test auth login api", function () {

  it("should return a html page with having text 'Expenses Tracker'", async () => {
    const { expect, request } = await get_chai();
    const req = request
      .execute(app)
      .get("/")
      .send();
    const res = await req;
    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Expenses Tracker");
  });
});