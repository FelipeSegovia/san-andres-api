"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("parents", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      parentType: {
        type: Sequelize.ENUM("MADRE", "PADRE"),
        allowNull: false,
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
        allowNull: true,
      },
      nationality: {
        type: Sequelize.STRING(100),
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
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(150),
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

    // Crear índice compuesto en (studentId, parentType)
    await queryInterface.addIndex("parents", ["studentId", "parentType"], {
      name: "parents_student_id_parent_type_idx",
    });

    // Crear índice en rut
    await queryInterface.addIndex("parents", ["rut"], {
      name: "parents_rut_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("parents");
  },
};
