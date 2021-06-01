"use strict"
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("projectstags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      projectId: {
        type: DataTypes.UUID,
        references: {
          model: "projects",
          key: "id",
          as: "projectId",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      tagId: {
        type: DataTypes.UUID,
        references: {
          model: "tags",
          key: "id",
          as: "tagId",
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("projectstags")
  },
}
