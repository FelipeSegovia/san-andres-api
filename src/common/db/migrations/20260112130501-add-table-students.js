"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
        unique: true,
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      nationality: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      currentAddress: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      commune: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("Masculino", "Femenino", "Otro"),
        allowNull: false,
      },
      prevision: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      medicalConditions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      medications: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      specialNeeds: {
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
    await queryInterface.dropTable("students");
  },
};
