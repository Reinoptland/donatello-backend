const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)
const db = require("../models")

describe("app/users", () => {
  // setup
  beforeEach(async () => {
    await db.User.destroy({
      where: {},
    })
  })
  // tear down
  afterAll(async () => {
    await db.User.destroy({
      where: {},
    })
    await db.sequelize.close()
  })

  test("should ", async (done) => {
    // arrange
    const body = {
      email: "natalia@email.com",
      password: "password",
      firstName: "Natalia",
      lastName: "P",
      bankAccount: "NL56INGB0000111122",
    }
    // act
    const response = await request.post("/users").send(body)
    // assert
    expect(response.body).toBeDefined()
    expect(response.status).toBe(200)
    const createdUser = await db.User.findOne({
      where: {
        email: "natalia@email.com",
      },
    })
    expect(createdUser).not.toBe(null)
    done()
  })
})
