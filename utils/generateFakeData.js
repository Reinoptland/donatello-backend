const faker = require("faker")

const fakeUser = () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(8),
    bankAccount: faker.finance.iban(),
  }
  return user
}

const fakeProject = (userId) => {
  return {
    projectName: faker.company.bsBuzz(),
    projectDescription: faker.company.catchPhrase(),
    userId,
  }
}

module.exports = { fakeUser, fakeProject }
