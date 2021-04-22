const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)
const db = require("../models")
const jwt = require("jsonwebtoken")

// setup
beforeEach(async () => {
  await db.Projects.destroy({
    where: {},
  })
  await db.User.destroy({
    where: {},
  })
})
// tear down
afterAll(async () => {
  await db.Projects.destroy({
    where: {},
  })
  await db.User.destroy({
    where: {},
  })
  await db.sequelize.close()
})

describe("app/signup", () => {
  test("should create a new user", async (done) => {
    // arrange
    const body = {
      email: "jane@email.com",
      password: "password",
      firstName: "Natalia",
      lastName: "P",
      bankAccount: "NL56INGB0000111122",
    }
    // act
    const response = await request.post("/signup").send(body)
    // assert
    expect(response.body).toBeDefined()
    expect(response.status).toBe(200)
    const createdUser = await db.User.findOne({
      where: {
        email: "jane@email.com",
      },
    })
    expect(createdUser).not.toBe(null)
    done()
  })
})

describe("auth", () => {
  test("/login when a user exists in the db we should respond with an access token when email and password match", async (done) => {
    // arrange
    // create a user in the db
    const user = {
      email: "natalia@email.com",
      password: "password",
      firstName: "Natalia",
      lastName: "P",
      bankAccount: "NL56INGB0000111122",
    }
    const responseNewUser = await request.post("/signup").send(user)
    // create a req.body to send -> email and password
    const body = {
      email: responseNewUser.body.email,
      password: responseNewUser.body.password,
    }

    // act
    // Send req.body to /login like in line 31
    const responseToken = await request.post("/login").send(body)

    // assert
    // get back the access token & status 200
    expect(responseToken.body.token).toBeDefined()
    expect(responseToken.status).toBe(200)
    // jwt verify -> user id of the token matches the user id of the new created user?
    const userToken = await jwt.verify(
      responseToken.body.token,
      process.env.TOKEN_SECRET
    )
    expect(userToken.userId).toBe(responseNewUser.body.id)
    done()
  })

  test("/login when a user doesn't exist in the db respond with an error", async (done) => {
    // arrange
    const body = {
      email: "natalia@email.com",
      password: "password",
    }

    // act
    const responseToken = await request.post("/login").send(body)

    // assert
    expect(responseToken.status).toBe(404)
    done()
  })
  test("/login when a user exists but the password doesn't match in the db respond with an error", async (done) => {
    // arrange
    // create a user in the db
    const user = {
      email: "natalia@email.com",
      password: "password",
      firstName: "Natalia",
      lastName: "P",
      bankAccount: "NL56INGB0000111122",
    }
    const responseNewUser = await request.post("/signup").send(user)
    // create a req.body to send -> email and password
    const body = {
      email: responseNewUser.body.email,
      password: "blabla",
    }

    // act
    // Send req.body to /login like in line 31
    const responseToken = await request.post("/login").send(body)

    // assert
    expect(responseToken.status).toBe(404)
    done()
  })
})

describe("new project", () => {
  test("should create a new project when sent the valid access token", async (done) => {
    // arrange
    // create a user
    const user = {
      email: "antonko@email.com",
      password: "password",
      firstName: "Anton",
      lastName: "P",
      bankAccount: "NL56INGB0000111122",
    }
    const responseNewUser = await request.post("/signup").send(user)
    const userId = responseNewUser.body.id
    // console.log("userId: ", userId)
    const bodyToken = {
      email: responseNewUser.body.email,
      password: responseNewUser.body.password,
    }
    // console.log("bodyToken: ", bodyToken)

    // create an access token -> use the jwt sign. encrypt the user id and the secret into a token
    const responseToken = await request.post("/login").send(bodyToken)
    const token = responseToken.body.token
    // create a body with all the mandatory project data
    const body = {
      projectName: "Project!",
      projectDescription: "This is a nerdy project!",
      userId: userId,
    }
    // console.log("body including userId: ", body)
    // act
    // send the token in the authorization header & the body with the data

    const responsePosts = await request
      .post("/new-project")
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    console.log("responsePosts has body???", responsePosts.body)
    // assert
    // status 201
    expect(responsePosts.body).toBeDefined()
    expect(responsePosts.status).toBe(200)
    // get back the data of the project we created
    done()
  })

  test("should NOT create a new project when sent a malformed access token", async (done) => {
    const user = {
      email: "nataliaaaa@email.com",
      password: "password",
      firstName: "Anton",
      lastName: "P",
      bankAccount: "NL56INGB0000111122",
    }
    const responseNewUser = await request.post("/signup").send(user)
    const userId = responseNewUser.body.id
    // console.log("userId: ", userId)
    // create a body with all the mandatory project data
    const body = {
      projectName: "Project!",
      projectDescription: "This is a nerdy project!",
      userId: userId,
    }
    // console.log("body including userId: ", body)

    // act
    // send "bla" in the authorization header
    const responsePosts = await request
      .post("/new-project")
      .set("Authorization", `Bearer "bla"`)
      .send(body)

    // assert
    // status 400
    expect(responsePosts.status).toBe(403)

    done()
  })
  test.todo("should NOT create a new project when sent an expired access token")
  // arrange
  // create a new token using jwt sign -> .sign(payload, secret, { expiresIn: '-10s' }

  // act
  // send the expired token in the authorization header

  // assert
  // status 401
})
