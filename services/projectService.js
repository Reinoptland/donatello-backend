const { Projects } = require("../models")

const findProjectById = async (projectId) => {
  return await Projects.findOne({
    where: { id: projectId },
  })
}

module.exports = { findProjectById }
