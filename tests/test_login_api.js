const { app } = require("../app");
const get_chai = require("./utils/get_chai");

describe("test auth login api", function () {
  it("should return user's name and the token,  user's name should be 'Reza' and token should be a string with format '(.+)\.(.+)\.(.+)'", async () => {
    const { expect, request } = await get_chai();
    const req = request
      .execute(app)
      .post("/api/v1/auth/login")
      // .query({ first: 7, second: 6 })
      .send({email: "r.zahedi@gmail.com", password: "zahedi"});
    const res = await req;
    expect(res).to.have.status(200);
    expect(res).to.have.property("body");

    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("name");
    expect(res.body.user.name).to.be.a("string");
    expect(res.body.user.name).to.be.equal("Reza");

    expect(res.body).to.have.property("token");
    expect(res.body.token).to.be.a("string")
    expect(res.body.token.split(".")).to.have.lengthOf(3)
  });

  it("should return 401 status code for unauthorize user", async () => {
    const { expect, request } = await get_chai();
    const req = request
      .execute(app)
      .post("/api/v1/auth/login")
      // .query({ first: 7, second: 6 })
      .send({email: "r.zahedi@gmail.com", password: "werfewsdfds"});
    const res = await req;
    expect(res).to.have.status(401);
  });
});