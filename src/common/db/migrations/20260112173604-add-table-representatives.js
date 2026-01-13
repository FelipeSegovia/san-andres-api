"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("representatives", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      names: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lastNames: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rut: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      relationship: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      commune: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      mobilePhone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      educationLevel: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      workplace: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      workplacePhone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      workplaceAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("representatives");
  },
};
