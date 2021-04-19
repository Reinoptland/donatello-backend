const faker = require("faker")
const { User } = require("../models")

// ;("use strict")

const users = [...Array(100)].map((user) => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
  bankAccount: faker.finance.iban(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// console.log("users:", users)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("users", users, {})

    const usersArray = await User.findAll()
    const randomIdGenerate = () => Math.floor(Math.random() * 101)

    const projects = [...Array(20)].map((project) => ({
      projectName: faker.company.bsBuzz(),
      projectDescription: faker.company.catchPhrase(),
      userId: usersArray[randomIdGenerate()].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    return queryInterface.bulkInsert("projects", projects, {})

    // const projectsArray = await Projects.findAll()
    // const projectsIds = projectsArray.map((project) => {
    //   return project.id
    // })

    // const donations = [...Array(20)].map((donation) => ({
    //   donationAmount: faker.datatype.number(1000),
    //   projectId: projectsArray[].id,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }))

    // return await queryInterface.bulkInsert("donations", donations, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {})
    await queryInterface.bulkDelete("projects", null, {})
  },
}
