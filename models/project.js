"use strict"
const { Model, Op } = require("sequelize")

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
        as: "tags",
      })
      this.belongsToMany(Tag, {
        through: "ProjectTag",
        foreignKey: "projectId",
        otherKey: "tagId",
        as: "matchingTag",
      })
      this.hasMany(Donation, { foreignKey: "projectId", as: "donations" })
      // Adding scopes here that have related models included
      // These related models are not defined yet in the scopes object
      // In Project.init
      this.addScope("byTags", (tagNames) => {
        if (tagNames.length === 0) {
          return {}
        }
        return {
          include: [
            {
              model: Tag,
              as: "matchingTag",
              where: { name: { [Op.in]: tagNames } },
            },
          ],
        }
      })
    }

    toJSON() {
      return { ...this.get(), updatedAt: undefined }
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
        // byTags(tagNames) {
        //   return {
        //     include: [
        //       {
        //         model: Tag,
        //         as: "matchingTag",
        //         where: { tag: { [Op.in]: tagNames } },
        //       },
        //       { model: Tag },
        //     ],
        //   }
        // },
      },
      sequelize,
      tableName: "projects",
      modelName: "Project",
    }
  )
  return Projects
}
