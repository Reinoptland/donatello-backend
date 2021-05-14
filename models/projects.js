"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Tag, Donation, ProjectTag }) {
      // define association here
      // foreignKey is from this table and belongs to User
      this.belongsTo(User, { foreignKey: "userId", as: "user" })
      this.hasMany(ProjectTag, { foreignKey: "projectId" })
      this.belongsToMany(Tag, {
        through: "ProjectTag",
        foreignKey: "projectId",
        otherKey: "tagId",
      })
      this.hasMany(Donation, { foreignKey: "projectId", as: "donations" })
    }

    toJSON() {
      return { ...this.get() }
    }
  }
  Projects.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Project must have a name." },
          notEmpty: { msg: "Project name must not be empty." },
        },
      },
      projectDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Project must have a description." },
          notEmpty: { msg: "Project description must not be empty." },
        },
      },
      totalDonationAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalDonationCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },

    {
      scopes: {
        recent: {
          order: [["updatedAt", "DESC"]],
        },
        totalDonationAmount: {
          order: [["totalDonationAmount", "DESC"]],
        },
        totalDonationCount: {
          order: [["totalDonationCount", "DESC"]],
        },
        alphabetically: {
          order: [["projectName", "ASC"]],
        },
      },
      sequelize,
      tableName: "projects",
      modelName: "Project",
    }
  )
  return Projects
}
