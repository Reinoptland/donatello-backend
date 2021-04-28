const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)
const db = require("../models")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../middlewares/auth")
const { fakeUser, fakeProject } = require("../utils/generate-fake-data")

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

describe("/signup", () => {
  test("should create a new user", async (done) => {
    // arrange
    const body = await fakeUser()
    // act
    const response = await request.post("/signup").send(body)
    // assert
    expect(response.body).toBeDefined()
    expect(response.status).toBe(200)
    const createdUser = await db.User.findOne({
      where: {
        email: body.email,
      },
    })
    expect(createdUser).not.toBe(null)
    done()
  })
})

describe("/login", () => {
  test("when a user exists in the db we should respond with an access token when email and password match", async (done) => {
    // arrange
    // create a user in the db
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    // create a req.body to send -> email and password
    const body = {
      email: newUser.email,
      password: newUser.password,
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
    expect(userToken.userId).toBe(newUser.id)
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
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    // create a req.body to send -> email and password
    const body = {
      email: newUser.email,
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

describe("/project", () => {
  test("should create a new project when sent the valid access token", async (done) => {
    // arrange
    // create a user
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id
    const body = fakeProject(userId)

    const token = generateToken({ userId })
    // act
    // send the token in the authorization header & the body with the data

    const responseProject = await request
      .post("/project")
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    // status 201
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(200)
    // get back the data of the project we created
    done()
  })

  test("should NOT create a new project when sent a malformed access token", async (done) => {
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id
    // create a body with all the mandatory project data
    const body = fakeProject(userId)

    // act
    // send "bla" in the authorization header
    const responseProject = await request
      .post("/project")
      .set("Authorization", `Bearer "bla"`)
      .send(body)

    // assert
    // status 400
    expect(responseProject.status).toBe(401)

    done()
  })

  test("should NOT create a new project when sent an expired access token", async (done) => {
    // arrange
    // create a new token using jwt sign -> .sign(payload, secret, { expiresIn: '-10s' }
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id
    const body = fakeProject(userId)

    const userIdObj = { userId }
    const token = jwt.sign(userIdObj, process.env.TOKEN_SECRET, {
      expiresIn: "-10s",
    })

    // act
    // send the expired token in the authorization header
    const responseProject = await request
      .post("/project")
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    // status 401
    expect(responseProject.status).toBe(401)

    done()
  })
})

describe("/my-account/:userId (get)", () => {
  test("should return an overview of user", async (done) => {
    // arrange
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id

    const token = generateToken({ userId })

    // act
    const responseUpdatedUser = await request
      .get("/my-account/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseUpdatedUser.body).toBeDefined()
    expect(responseUpdatedUser.status).toBe(200)
    const responseFirstName = responseUpdatedUser.body.firstName
    expect(responseFirstName).toBe(newUser.firstName)
    done()
  })
  test.todo(
    "/my-account/edit-details should NOT return an updated user if passed a wrong userId"
  )
})

describe("/my-account/:userId (patch)", () => {
  test("should return an updated user", async (done) => {
    // arrange
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id

    const body = {
      firstName: "Natalia",
      email: "natalia@email.com",
    }

    const token = generateToken({ userId })

    // act
    const responseUpdatedUser = await request
      .patch("/my-account/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseUpdatedUser.body).toBeDefined()
    expect(responseUpdatedUser.status).toBe(200)
    const responseFirstName = responseUpdatedUser.body.firstName
    expect(responseFirstName).toBe(body.firstName)
    done()
  })
  test.todo(
    "/my-account/edit-details should NOT return an updated user if passed a wrong userId"
  )
})

describe("project/:projectId (patch)", () => {
  test(" should return an updated project", async (done) => {
    // arrange
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id
    const newProject = await fakeProject(userId)
    const createProject = await db.Projects.create(newProject)
    const projectId = createProject.id
    const body = {
      projectName: "New project",
      projectDescription: "Let's see if this works!",
    }
    const token = generateToken({ userId })

    // act
    const responseUpdatedProject = await request
      .patch("/project/" + projectId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseUpdatedProject.body).toBeDefined()
    expect(responseUpdatedProject.status).toBe(200)
    const responseProjectName = responseUpdatedProject.body.projectName
    expect(responseProjectName).toBe(body.projectName)
    done()
  })
})

describe("/delete-user/:id", () => {
  test(" should return 204 if successful", async (done) => {
    // arrange
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id
    const token = generateToken({ userId })

    const newProject = await fakeProject(userId)
    const createProject = await db.Projects.create(newProject)
    //act
    const responseDeletedUser = await request
      .delete("/delete-user/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send(userId)

    // assert
    expect(responseDeletedUser.status).toBe(204)
    done()
  })
})

describe("/delete-project/:id", () => {
  test("should return 204 if successful", async (done) => {
    // arrange
    const user = await fakeUser()
    const newUser = await db.User.create(user)
    const userId = newUser.id
    const newProject = await fakeProject(userId)
    const createProject = await db.Projects.create(newProject)
    const projectId = createProject.id
    const token = generateToken({ userId })

    //act
    const responseDeletedProject = await request
      .delete("/delete-project/" + projectId)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseDeletedProject.status).toBe(204)
    done()
  })
})

describe("overview of all projects by user", () => {
  test.todo(
    "/projects/:userId should return all projects for a specific user"
    // arrange
    // Create a user & token.
    // const user = await fakeUser()
    // const newUser = await db.User.create(user)
    // const userId = newUser.id

    // With userId & token, create a project

    // act
    // const responseProjects = await request.get("/projects/my-project").send(userId)

    // assert
    // status 200
    // responseProjects to be defined
  )
  test.todo(
    "/projects/my-projects should return an error if the user doesn't have any projects"
  )
})
describe("overview of a specific project", () => {
  test.todo(
    "/projects/:projectId should return the project with the associated id"
  )
  test.todo(
    "/projects/:projectId should return an error when the associated project id is missing in the db"
  )
})
