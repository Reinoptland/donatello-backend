const faker = require("faker")
// ;("use strict")

const users = [...Array(100)].map((user) => ({
  uuid: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
  bankAccount: faker.finance.iban(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))

console.log("users:", users)
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", users, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {})
  },
}
