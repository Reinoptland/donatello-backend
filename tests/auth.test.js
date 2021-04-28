const { generateToken, authenticateToken } = require("../middlewares/auth")

describe("auth middleware", () => {
  test.only("should ", async () => {
    // console.log(process.env.TOKEN_SECRET)
    const token = generateToken({ userId: 1 })
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const res = {
      sendStatus: jest.fn(),
    }
    const next = jest.fn()

    authenticateToken(req, res, next)
    // console.log(next.mock)
    // expect(next.mock.calls.length).toBe(1)
    expect(next).toHaveBeenCalled()
    expect(req.user.userId).toBe(1)
  })

  test.todo("if auth header is not present, should respond with 401")
  test.todo(
    "if the auth header does not contain Bearer, should respond with 400 (have to implement in the middleware as well)"
  )
  test.todo("if the token is expired, should respond with 401")
  test.todo("implement feedback messages in errors")
})
