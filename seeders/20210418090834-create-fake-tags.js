const faker = require("faker")

const tags = [...Array(20)].map((tag) => ({
  tag: faker.name.jobArea(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))

console.log("tags:", tags)
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tags", tags, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tags", null, {})
  },
}
