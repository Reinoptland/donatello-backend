"use strict"
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("donations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
      },
      donationAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
    })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("donations")
  },
}
