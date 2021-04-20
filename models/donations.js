"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Donations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Projects }) {
      // define association here
      this.belongsTo(Projects, { foreignKey: "projectId", as: "projects" })
    }
    toJSON() {
      return { ...this.get(), id: undefined }
    }
  }
  Donations.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      // transactionId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   defaultValue: DataTypes.UUIDV4,
      // },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      donationAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
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
      tableName: "donations",
      modelName: "Donations",
    }
  )
  return Donations
}
