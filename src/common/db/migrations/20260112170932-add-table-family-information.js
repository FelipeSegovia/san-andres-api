"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("family_information", {
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
      householdHead: {
        type: Sequelize.ENUM(
          "PADRE",
          "MADRE",
          "AMBOS",
          "ABUELOS MAT",
          "ABUELOS PAT",
          "OTROS"
        ),
        allowNull: true,
      },
      householdHeadOther: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      monthlyIncome: {
        type: Sequelize.ENUM(
          "Menos de $100.000",
          "Entre $100.000 y $200.000",
          "Entre $200.001 y $300.000",
          "Entre $300.001 y $400.000",
          "Entre $400.001 y $600.000",
          "Más de $600.000"
        ),
        allowNull: true,
      },
      socialProgramChileSolidario: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      socialProgramPuente: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      socialProgramSuf: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      socialProgramOther: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      housingType: {
        type: Sequelize.ENUM("PROPIA", "ARRENDADA", "ALLEGADO"),
        allowNull: true,
      },
      housingStructure: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      hasDrinkingWater: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hasElectricity: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bedroomsCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      residentsCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      casIndex: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable("family_information");
  },
};
