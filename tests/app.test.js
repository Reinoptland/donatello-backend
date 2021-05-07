const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)
const db = require("../models")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/generateToken")
const {
  fakeUser,
  fakeProject,
  fakeDonation,
  fakeTags,
} = require("../utils/generateFakeData")

// setup
beforeEach(async () => {
  await db.ProjectTag.destroy({ where: {} })
  await db.Tag.destroy({ where: {} })
  await db.Donation.destroy({ where: {} })
  await db.Project.destroy({ where: {} })
  await db.User.destroy({ where: {} })
})
// tear down
afterAll(async () => {
  await db.ProjectTag.destroy({ where: {} })
  await db.Tag.destroy({ where: {} })
  await db.Donation.destroy({ where: {} })
  await db.Project.destroy({ where: {} })
  await db.User.destroy({ where: {} })
  await db.sequelize.close()
})

describe("/login", () => {
  test("should respond with an access token when email and password match", async (done) => {
    // arrange
    const { id, email, password } = await db.User.create(fakeUser())
    const body = { email, password }

    // act
    const responseToken = await request.post("/login").send(body)

    // assert
    expect(responseToken.body.token).toBeDefined()
    expect(responseToken.status).toBe(200)
    const userToken = await jwt.verify(
      responseToken.body.token,
      process.env.TOKEN_SECRET
    )
    expect(userToken.userId).toBe(id)
    done()
  })

  test("should respond with an error when a user doesn't exist in the db", async (done) => {
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

  test("should respond with an error when a user exists but the password doesn't match in the db", async (done) => {
    // arrange
    const { email } = await db.User.create(fakeUser())
    const body = { email, password: "blabla" }

    // act
    const responseToken = await request.post("/login").send(body)

    // assert
    expect(responseToken.status).toBe(404)
    done()
  })
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

    console.log("updated user:", responseUpdatedUser.body)

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

describe("/projects (get)", () => {
  test("should return 8 projects sorted by date", async (done) => {
    // arrange
    const limit = 8
    const offset = 0
    const sortBy = "recent"
    // const sortBy = "date"
    const { id: userId } = await db.User.create(fakeUser())

    for (i = 0; i < 10; i++) {
      await db.Project.create(fakeProject(userId))
    }

    // act
    const responseProject = await request
      .get("/projects")
      .query({ limit, offset, sortBy })
      .send()

    // assert
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(200)
    const responseLength = responseProject.body.sortedProjects.length
    expect(responseLength).toBe(8)
    done()
  })
  test("should return 8 projects sorted alphabetically", async (done) => {
    // arrange
    const limit = 8
    const offset = 0
    const sortBy = "alphabetically"
    // const sortBy = "date"
    const { id: userId } = await db.User.create(fakeUser())

    for (i = 0; i < 10; i++) {
      await db.Project.create(fakeProject(userId))
    }
    await db.Project.create({
      projectName: "AAAAAA",
      projectDescription: "first!",
      userId: userId,
    })

    // act
    const responseProject = await request
      .get("/projects")
      .query({ limit, offset, sortBy })
      .send()

    // assert
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(200)
    const responseLength = responseProject.body.sortedProjects.length
    expect(responseLength).toBe(8)
    expect(responseProject.body.sortedProjects[0].projectName).toBe("AAAAAA")
    done()
  })
})

describe("/projects/:userId (post)", () => {
  test("should create a new project when sent valid access token, project name & desc, & tagIds", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const token = generateToken({ userId })
    const tagNames = fakeTags()
    console.log(tagNames)
    const project = fakeProject(userId)
    const tags = await db.Tag.bulkCreate(
      tagNames.map((tagName) => ({ tag: tagName }))
    )

    console.log("tags created?", tags)
    const body = {
      project,
      tagIds: tags.map((tag) => tag.id),
    }

    console.log("body", body)
    // act
    const responseProject = await request
      .post("/projects/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseProject.body.ProjectTags).toHaveLength(2)
    expect(responseProject.status).toBe(200)
    done()
  })

  test.todo(
    ""

    // test("should NOT create a new project when sent a malformed access token", async (done) => {
    //   const user = await fakeUser()
    //   const newUser = await db.User.create(user)
    //   const userId = newUser.id
    //   // create a body with all the mandatory project data
    //   const body = fakeProject(userId)

    //   // act
    //   // send "bla" in the authorization header
    //   const responseProject = await request
    //     .post("/projects")
    //     .set("Authorization", `Bearer "bla"`)
    //     .send(body)

    //   // assert
    //   expect(responseProject.status).toBe(401)

    //   done()
    // })

    // test("should NOT create a new project when sent an expired access token", async (done) => {
    //   // arrange
    //   // create a new token using jwt sign -> .sign(payload, secret, { expiresIn: '-10s' }
    //   const user = await fakeUser()
    //   const newUser = await db.User.create(user)
    //   const userId = newUser.id
    //   const body = fakeProject(userId)

    //   const userIdObj = { userId }
    //   const token = jwt.sign(userIdObj, process.env.TOKEN_SECRET, {
    //     expiresIn: "-10s",
    //   })

    //   // act
    //   // send the expired token in the authorization header
    //   const responseProject = await request
    //     .post("/projects")
    //     .set("Authorization", `Bearer ${token}`)
    //     .send(body)

    //   // assert
    //   // status 401
    //   expect(responseProject.status).toBe(401)

    //   done()
    // })
  )
})

describe("/projects/:projectId (patch)", () => {
  test("should return an updated project", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const { id: projectId } = await db.Project.create(fakeProject(userId))
    const token = generateToken({ userId })

    const body = {
      projectName: "New project",
      projectDescription: "Let's see if this works!",
    }

    // act
    const responseUpdatedProject = await request
      .patch("/projects/" + projectId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseUpdatedProject.body).toBeDefined()
    // expect(responseUpdatedProject.body).toBe(null)
    expect(responseUpdatedProject.status).toBe(200)
    const responseProjectName = responseUpdatedProject.body.projectName
    expect(responseProjectName).toBe(body.projectName)
    done()
  })
  test("should return an updated project", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const { id: projectId } = await db.Project.create(fakeProject(userId))
    const token = generateToken({ userId })

    const body = {
      projectName: "New project",
      projectDescription: "Let's see if this works!",
      somethingElse: "blaaa",
    }

    // act
    const responseUpdatedProject = await request
      .patch("/projects/" + projectId)
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseUpdatedProject.body).toBeDefined()
    const expectedResponse =
      "somethingElse can't be updated. Only projectName and projectDescription can be updated."
    expect(responseUpdatedProject.body).toBe(expectedResponse)
    expect(responseUpdatedProject.status).toBe(403)
    done()
  })
})

describe("/projects/:projectId/tags (post)", () => {
  test("should return an updated tag", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const tagNames = fakeTags()

    const tags = await db.Tag.bulkCreate(
      tagNames.map((tagName) => ({ tag: tagName }))
    )
    const tagIds = tags.map((tag) => tag.id)
    const projectDBCreated = await db.Project.create(fakeProject(userId))

    console.log("projectDBCreated?", projectDBCreated)
    const projectId = projectDBCreated.id
    const body = {
      tagIds,
    }
    console.log("body", body)
    const token = generateToken({ userId })

    // act
    const responseUpdatedTags = await request
      .post("/projects/" + projectId + "/tags")
      .set("Authorization", `Bearer ${token}`)
      .send(body)

    // assert
    expect(responseUpdatedTags.body).toBeDefined()
    expect(responseUpdatedTags.body).toHaveLength(2)
    expect(responseUpdatedTags.body[0].projectId).toBe(projectId)
    expect(responseUpdatedTags.status).toBe(200)
    done()
  })
})

describe("/projects/:projectId/tags/:tagId (delete)", () => {
  test("should return 204 if successful", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const tagNames = fakeTags()

    const tags = await db.Tag.bulkCreate(
      tagNames.map((tagName) => ({ tag: tagName }))
    )
    const tagIds = tags.map((tag) => ({ tagId: tag.id }))
    const projectDBCreated = await db.Project.create(
      {
        ...fakeProject(userId),
        ProjectTags: tagIds,
      },
      { include: [db.ProjectTag] }
    )

    const projectId = projectDBCreated.id
    const tagId = projectDBCreated.ProjectTags[0].tagId
    const token = generateToken({ userId })

    //act
    const responseDeletedProject = await request
      .delete(`/projects/${projectId}/tags/${tagId}`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseDeletedProject.status).toBe(204)
    done()
  })
})

describe("/projects/:projectId (delete)", () => {
  test("should return 204 if successful", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const { id: projectId } = await db.Project.create(fakeProject(userId))
    const token = generateToken({ userId })

    //act
    const responseDeletedProject = await request
      .delete("/projects/" + projectId)
      .set("Authorization", `Bearer ${token}`)
      .send()

    // assert
    expect(responseDeletedProject.status).toBe(204)
    done()
  })
})

describe("/projects/:userId (get)", () => {
  test("should return all projects for a specific user", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const createProject = await db.Project.create(fakeProject(userId))

    // act
    const responseProject = await request.get("/projects/" + userId).send()

    // assert
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(200)
    done()
  })
  test.todo(
    "/projects/:userId should return an error if the user doesn't have any projects"
  )
})

describe("/projects/:projectId (get)", () => {
  test("should return the project with the associated id", async (done) => {
    // arrange
    const { id: userId } = await db.User.create(fakeUser())
    const { id: projectId } = await db.Project.create(fakeProject(userId))
    const donation = await db.Donation.create(fakeDonation(projectId))
    // act

    // const responseProject = await request.get("/projects/" + projectId + "/donations").send()
    const responseProject = await request
      .get(`/projects/${projectId}/donations`)
      .send()
    // assert
    // console.log("what is responseProject.body?", responseProject.body)
    expect(responseProject.body).toBeDefined()
    expect(responseProject.status).toBe(200)
    done()
  })
  test.todo(
    "/projects/:projectId should return an error when the associated project id is missing in the db"
  )
})
