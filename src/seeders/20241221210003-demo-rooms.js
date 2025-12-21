'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rooms = [
      { room_number: '101', floor: 1, capacity: 4, status: 'available' },
      { room_number: '102', floor: 1, capacity: 4, status: 'available' },
      { room_number: '103', floor: 1, capacity: 4, status: 'occupied' },
      { room_number: '201', floor: 2, capacity: 4, status: 'available' },
      { room_number: '202', floor: 2, capacity: 4, status: 'occupied' },
      { room_number: '203', floor: 2, capacity: 4, status: 'maintenance' },
      { room_number: '301', floor: 3, capacity: 4, status: 'available' },
      { room_number: '302', floor: 3, capacity: 4, status: 'available' }
    ];

    const roomsWithTimestamps = rooms.map(room => ({
      ...room,
      created_at: new Date(),
      updated_at: new Date()
    }));

    return queryInterface.bulkInsert('rooms', roomsWithTimestamps);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rooms', null, {});
  }
};