'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [students] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE user_type = 'student' ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const payments = [];
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    students.forEach((student, index) => {
      payments.push(
        {
          student_id: student.id,
          amount: 3500.00,
          gst_amount: 630.00,
          total_amount: 4130.00,
          payment_date: new Date(),
          payment_method: 'Online Transfer',
          status: 'paid',
          receipt_number: `RCP${currentYear}${String(index + 1).padStart(4, '0')}`,
          month: currentMonth,
          year: currentYear,
          created_at: new Date()
        },
        {
          student_id: student.id,
          amount: 3500.00,
          gst_amount: 630.00,
          total_amount: 4130.00,
          payment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          payment_method: 'Cash',
          status: 'paid',
          receipt_number: `RCP${currentYear}${String(index + 3).padStart(4, '0')}`,
          month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'long' }),
          year: currentYear,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      );
    });

    return queryInterface.bulkInsert('fee_payments', payments);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fee_payments', null, {});
  }
};