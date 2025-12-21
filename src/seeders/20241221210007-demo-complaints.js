'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [students] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE user_type = 'student' ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    return queryInterface.bulkInsert('complaints', [
      {
        student_id: students[0].id,
        subject: 'WiFi Connection Issue',
        category: 'Infrastructure',
        description: 'The WiFi connection in my room is very slow and keeps disconnecting frequently. This is affecting my studies and online classes.',
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        student_id: students[1].id,
        subject: 'Water Supply Problem',
        category: 'Maintenance',
        description: 'There is irregular water supply in the hostel, especially during morning hours. Please resolve this issue as soon as possible.',
        status: 'resolved',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      },
      {
        student_id: students[0].id,
        subject: 'Room Cleaning Service',
        category: 'Housekeeping',
        description: 'The room cleaning service has been irregular this week. The cleaning staff has not visited our room for the past 3 days.',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('complaints', null, {});
  }
};