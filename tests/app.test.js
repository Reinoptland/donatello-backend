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

describe("auth", () => {
  // do set up and tear down like in the above test

  test.todo(
    "/login when a user exists in the db we should respond with an access token when email and password match"
  )
  // arrange
  // create a user in the db
  // create a req.body to send -> email and password

  // act
  // Send req.body to /login like in line 31

  // assert
  // get back the access token
  // status
  // jwt verify -> user id of the token matches the user id of the new created user?

  test.todo("/login when a user doesn't exist in the db respond with an error")
  test.todo(
    "/login when a user exists but the password doesn't match in the db respond with an error"
  )
})

describe("new project", () => {
  test.todo("should create a new project when sent the valid access token")
  // arrange
  // create a user
  // create an access token -> use the jwt sign
  // encrypt the user id and the secret into a token
  // create a body with all the mandatory project data

  // act
  // send the token in the authorization header
  // send the body with the data

  // assert
  // status 201
  // get back the data of the project we created

  test.todo(
    "should NOT create a new project when sent a malformed access token"
  )
  // act
  // send "bla" in the authorization header

  // assert
  // status 400
  test.todo("should NOT create a new project when sent an expired access token")
  // arrange
  // create a new token using jwt sign -> .sign(payload, secret, { expiresIn: '-10s' }

  // act
  // send the expired token in the authorization header

  // assert
  // status 401
})
