tags = [
  "Art&Music",
  "Product",
  "Social",
  "Technology",
  "Sports",
  "Games",
  "Kids",
  "Fashion",
  "Health",
  "Community",
]

const tagsSeed = tags.map((tag) => ({
  tag,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// console.log("tags:", tagsSeed)
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tags", tagsSeed, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tags", null, {})
  },
}
