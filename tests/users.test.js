const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)
const db = require("../models")
const { generateToken } = require("../utils/generateToken")
const { fakeUser, fakeProject } = require("../utils/generateFakeData")

// setup
beforeEach(async () => {
  await db.Project.destroy({ where: {} })
  await db.User.destroy({ where: {} })
})
// tear down
afterAll(async () => {
  await db.Project.destroy({ where: {} })
  await db.User.destroy({ where: {} })
  await db.sequelize.close()
})

describe("/users", () => {
  test("should create a new user", async (done) => {
    // arrange
    const body = fakeUser()
    // act
    const response = await request.post("/users").send(body)
    // assert
    expect(response.body).toBeDefined()
    expect(response.status).toBe(200)
    const createdUser = await db.User.findOne({ where: { email: body.email } })
    expect(createdUser).not.toBe(null)
    done()
  })

  test("should return an error if password is shorter than 6 characters", async (done) => {
    // arrange
    const body = fakeUser()
    body.password = "pass"

    // act
    const response = await request.post("/users").send(body)
    // assert
    expect(response.body).toBeDefined()
    expect(response.status).toBe(400)
    done()
  })
  test("should return an error if an account with the email already exists", async (done) => {
    // arrange
    const body = fakeUser()
    await db.User.create(body)

    // act
    const response = await request.post("/users").send(body)
    // assert
    expect(response.body).toBeDefined()
    expect(response.status).toBe(400)
    done()
  })
})

describe("/users/:userId (get)", () => {
  test("should return an overview of user", async (done) => {
    // arrange
    const { id: userId, firstName } = await db.User.create(fakeUser())
    const token = generateToken({ userId })

    // act
    const responseUpdatedUser = await request
      .get("/users/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseUpdatedUser.body).toBeDefined()
    expect(responseUpdatedUser.status).toBe(200)
    const responseFirstName = responseUpdatedUser.body.firstName
    expect(responseFirstName).toBe(firstName)
    done()
  })
  test("should NOT return user data if token userId is different from param userId", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const token = generateToken({ userId })

    // act
    const responseUpdatedUser = await request
      .get("/users/" + "bla")
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseUpdatedUser.body).toBeDefined()
    expect(responseUpdatedUser.status).toBe(401)
    done()
  })
})

describe("/users/:userId/projects (get)", () => {
  test("should return all projects for a specific user", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    await db.Project.create(fakeProject(userId))

    // act
    const responseProject = await request
      .get(`/users/${userId}/projects`)
      .send()

    // assert
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(200)
    done()
  })
  test("should return an error if the user doesn't have any projects", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())

    // act
    const responseProject = await request
      .get(`/users/${userId}/projects`)
      .send()

    // assert
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(404)
    done()
  })
})

describe("/users/:userId (patch)", () => {
  test("should return an updated user", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const body = {
      id: userId,
      firstName: "Natalia",
      email: "natalia@email.com",
    }
    const token = generateToken({ userId })

    // act
    const responseUpdatedUser = await request
      .patch("/users/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseUpdatedUser.body).toBeDefined()
    expect(responseUpdatedUser.status).toBe(200)
    const responseFirstName = responseUpdatedUser.body.firstName
    expect(responseFirstName).toBe(body.firstName)
    done()
  })
  test("should return an error if send wrong data", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const token = generateToken({ userId })
    const body = {
      // name: "bla",
      // email: "email",
      // id: userId,
      // firstName: "Natalia",
      // email: "natalia@email.com",
    }

    // act
    const responseUpdatedUser = await request
      .patch("/users/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert

    expect(responseUpdatedUser.body).toBeDefined()
    expect(responseUpdatedUser.status).toBe(400)
    done()
  })
})

describe("/users/:userId (delete)", () => {
  test(" should return 204 if successful", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const token = generateToken({ userId })
    const createProject = await db.Project.create(fakeProject(userId))

    //act
    const responseDeletedUser = await request
      .delete("/users/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseDeletedUser.status).toBe(204)
    done()
  })
  test(" should return 401 if passed wrong userId", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const token = generateToken({ userId: 5 })
    const createProject = await db.Project.create(fakeProject(userId))

    //act
    const responseDeletedUser = await request
      .delete("/users/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseDeletedUser.status).toBe(401)

    done()
  })
})
