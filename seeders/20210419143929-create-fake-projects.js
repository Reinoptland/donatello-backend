// const faker = require("faker")
// const { User } = require("../models")

// // ;("use strict")

// const projectsFunc = async () => {
//   const usersArray = await User.findAll()
//   const randomIdGenerate = () => Math.floor(Math.random() * 101)

//   const projects = [...Array(20)].map((project) => ({
//     projectName: faker.company.bsBuzz(),
//     projectDescription: faker.company.catchPhrase(),
//     userId: usersArray[randomIdGenerate()].id,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   }))

//   return projects
// }

// const projectsArray = projectsFunc()

// console.log("projectsArray:", projectsArray)

// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.bulkInsert("projects", projectsArray, {})

//     // const projectsArray = await Projects.findAll()
//     // const projectsIds = projectsArray.map((project) => {
//     //   return project.id
//     // })

//     // const donations = [...Array(20)].map((donation) => ({
//     //   donationAmount: faker.datatype.number(1000),
//     //   projectId: projectsArray[].id,
//     //   createdAt: new Date(),
//     //   updatedAt: new Date(),
//     // }))

//     // return await queryInterface.bulkInsert("donations", donations, {})
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete("projects", null, {})
//   },
// }
