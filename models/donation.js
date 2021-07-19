"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Donations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project }) {
      // define association here
      this.belongsTo(Project, { foreignKey: "projectId", as: "project" });
    }
    toJSON() {
      return { ...this.get() };
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
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      donationAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Donation amount cannot be null." },
          notEmpty: { msg: "Donation amount must not be empty." },
        },
        defaultValue: "Anonymous Donatello Donation",
      },
      comment: {
        type: DataTypes.STRING,
      },
      molliePaymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "open",
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
      modelName: "Donation",
      hooks: {
        async beforeCreate(instance, options) {
          // set comments to default value in case of empty string or other falsy values
          instance.comment = instance.comment || null;
        },
      },
    }
  );
  return Donations;
};
