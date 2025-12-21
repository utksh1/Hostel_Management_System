'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id, roll_number FROM users WHERE user_type = 'student' ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const students = users.map((user, index) => ({
      user_id: user.id,
      roll_number: user.roll_number,
      department: index === 0 ? 'Computer Science' : 'Electrical Engineering',
      year_of_study: index === 0 ? 2 : 3,
      phone: `987654321${index}`,
      guardian_name: index === 0 ? 'Robert Smith' : 'Mary Johnson',
      guardian_phone: `987654321${index + 1}`,
      address: index === 0 ? '123 Main St, City, State' : '456 Oak Ave, City, State',
      gender: index === 0 ? 'male' : 'female',
      blood_group: index === 0 ? 'A+' : 'O+',
      created_at: new Date(),
      updated_at: new Date()
    }));

    return queryInterface.bulkInsert('students', students);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('students', null, {});
  }
};