"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Índice en students.rut (puede que ya exista como unique, pero se agrega explícitamente)
    await queryInterface.addIndex("students", ["rut"], {
      name: "idx_students_rut",
    });

    // Índice en parents.rut (ya existe, pero se agrega para consistencia)
    await queryInterface.addIndex("parents", ["rut"], {
      name: "idx_parents_rut",
    });

    // Índice en representatives.rut
    await queryInterface.addIndex("representatives", ["rut"], {
      name: "idx_representatives_rut",
    });

    // Índice en enrollments.status
    await queryInterface.addIndex("enrollments", ["status"], {
      name: "idx_enrollments_status",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("students", "idx_students_rut");
    await queryInterface.removeIndex("parents", "idx_parents_rut");
    await queryInterface.removeIndex(
      "representatives",
      "idx_representatives_rut"
    );
    await queryInterface.removeIndex("enrollments", "idx_enrollments_status");
  },
};
