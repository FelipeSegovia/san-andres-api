"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("enrollments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      enrollmentNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      academicYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gradeLevel: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      requiresJunaeb: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      requiresTransport: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      requiresExtendedHours: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      junaebPriority: {
        type: Sequelize.ENUM("ALTA", "BAJA"),
        allowNull: true,
      },
      transportPriority: {
        type: Sequelize.ENUM("ALTA", "BAJA"),
        allowNull: true,
      },
      extendedHoursPriority: {
        type: Sequelize.ENUM("ALTA", "BAJA"),
        allowNull: true,
      },
      observations: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      registeredByUserId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("ACTIVA", "RETIRADO", "CANCELADA"),
        defaultValue: "ACTIVA",
      },
      enrollmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
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

    // Crear índice en academicYear
    await queryInterface.addIndex("enrollments", ["academicYear"], {
      name: "idx_academic_year",
    });

    // Crear índice compuesto en (studentId, academicYear)
    await queryInterface.addIndex(
      "enrollments",
      ["studentId", "academicYear"],
      {
        name: "idx_student_year",
      }
    );

    // Crear constraint UNIQUE en (studentId, academicYear)
    await queryInterface.addIndex(
      "enrollments",
      ["studentId", "academicYear"],
      {
        name: "unique_student_year",
        unique: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("enrollments");
  },
};
