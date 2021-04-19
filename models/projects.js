"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      // foreignKey is from this table and belongs to User
      this.belongsTo(User, { foreignKey: "userId", as: "user" })
    }
    static associate({ Tags }) {
      // define association here
      // ProjectsTags is the name of the join table, need to create it!
      this.belongsToMany(Tags, { through: "ProjectsTags" })
    }
    static associate({ Donations }) {
      // define association here
      this.hasMany(Donations, { foreignKey: "projectId", as: "projects" })
    }

    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined }
    }
  }
  Projects.init(
    {
      // uuid: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      // },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      userId: {
        type: DataTypes.STRING,
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
      sequelize,
      tableName: "projects",
      modelName: "Projects",
    }
  )
  return Projects
}
