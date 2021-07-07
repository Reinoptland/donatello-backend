const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const db = require("../models");
const jwt = require("jsonwebtoken");
const { fakeUser } = require("../utils/generateFakeData");
const { TOKEN_SECRET } = require("../config/secrets");

// setup
beforeEach(async () => {
  await db.ProjectTag.destroy({ where: {} });
  await db.Tag.destroy({ where: {} });
  await db.Donation.destroy({ where: {} });
  await db.Project.destroy({ where: {} });
  await db.User.destroy({ where: {} });
});
// tear down
afterAll(async () => {
  await db.ProjectTag.destroy({ where: {} });
  await db.Tag.destroy({ where: {} });
  await db.Donation.destroy({ where: {} });
  await db.Project.destroy({ where: {} });
  await db.User.destroy({ where: {} });
  await db.sequelize.close();
});

describe("/login", () => {
  test("should respond with an access token when email and password match", async (done) => {
    // arrange
    const fakeUserData = fakeUser();
    const { id, email } = await db.User.create(fakeUserData);
    const body = { email, password: fakeUserData.password };
    // act
    const responseToken = await request.post("/login").send(body);

    // assert
    expect(responseToken.body.token).toBeDefined();
    expect(responseToken.status).toBe(200);
    const userToken = await jwt.verify(responseToken.body.token, TOKEN_SECRET);
    expect(userToken.userId).toBe(id);
    done();
  });

  test("should respond with an error when a user doesn't exist in the db", async (done) => {
    // arrange
    const body = {
      email: "natalia@email.com",
      password: "password",
    };

    // act
    const responseToken = await request.post("/login").send(body);

    // assert
    expect(responseToken.status).toBe(500);
    done();
  });

  test("should respond with an error when a user exists but the password doesn't match in the db", async (done) => {
    // arrange
    const { email } = await db.User.create(fakeUser());
    const body = { email, password: "blabla" };

    // act
    const responseToken = await request.post("/login").send(body);

    // assert
    expect(responseToken.status).toBe(404);
    done();
  });
});
