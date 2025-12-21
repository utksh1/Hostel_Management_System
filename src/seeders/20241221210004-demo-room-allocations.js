'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [students] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE user_type = 'student' ORDER BY id LIMIT 2`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const [rooms] = await queryInterface.sequelize.query(
      `SELECT id FROM rooms WHERE status = 'available' ORDER BY id LIMIT 2`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (students.length >= 2 && rooms.length >= 2) {
      return queryInterface.bulkInsert('room_allocations', [
        {
          student_id: students[0].id,
          room_id: rooms[0].id,
          status: 'active',
          allocated_at: new Date()
        },
        {
          student_id: students[1].id,
          room_id: rooms[1].id,
          status: 'active',
          allocated_at: new Date()
        }
      ]);
    }
    
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('room_allocations', null, {});
  }
};