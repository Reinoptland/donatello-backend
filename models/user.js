"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Projects }) {
      // define association here
      this.hasMany(Projects, { foreignKey: "userId", as: "projects" })
    }

    toJSON() {
      return { ...this.get(), id: undefined }
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      // uuid: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      // },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "This email is already used for another account." },
        validate: {
          notNull: { msg: "User must have an email." },
          notEmpty: { msg: "Email  must not be empty." },
          isEmail: { msg: "Must be a valid email address." },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validate password
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "User must have a first name." },
          notEmpty: { msg: "First name must not be empty." },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "User must have a last name." },
          notEmpty: { msg: "Last name must not be empty." },
        },
      },
      bankAccount: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validate bank account
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
      tableName: "users",
      modelName: "User",
    }
  )
  return User
}
