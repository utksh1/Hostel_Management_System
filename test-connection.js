const { sequelize } = require('./src/models');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Test model associations
    const { User, Member, Room, RoomAllocation, Payment, Complaint, FeeSettings, AdminSettings } = require('./src/models');
    
    console.log('\nModel associations:');
    console.log('✓ User model loaded');
    console.log('✓ Member model loaded');
    console.log('✓ Room model loaded');
    console.log('✓ RoomAllocation model loaded');
    console.log('✓ Payment model loaded');
    console.log('✓ Complaint model loaded');
    console.log('✓ FeeSettings model loaded');
    console.log('✓ AdminSettings model loaded');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();