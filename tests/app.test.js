const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)

describe("app/users", () => {
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
    done()
  })
})
