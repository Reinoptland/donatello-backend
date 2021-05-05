const { Project } = require("../models")

const findProjectById = async (projectId) => {
  return await Project.findOne({
    where: { id: projectId },
  })
}

module.exports = { findProjectById }
