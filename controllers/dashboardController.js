const db = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        // Members stats
        const [memberStats] = await db.query(`
            SELECT user_type, COUNT(*) as count 
            FROM users 
            GROUP BY user_type
        `);
        
        const totalMembers = memberStats.reduce((acc, curr) => acc + curr.count, 0);
        const studentCount = memberStats.find(s => s.user_type === 'student')?.count || 0;

        // Room stats
        const [roomStats] = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM rooms 
            GROUP BY status
        `);
        
        const totalRooms = roomStats.reduce((acc, curr) => acc + curr.count, 0);
        const availableRooms = roomStats.find(s => s.status === 'available')?.count || 0;

        // Revenue
        const [revenueResult] = await db.query(`
            SELECT SUM(total_amount) as total 
            FROM fee_payments 
            WHERE status = 'paid'
        `);
        const totalRevenue = revenueResult.total || 0;

        // Pending Payments
        const [pendingResult] = await db.query(`
            SELECT COUNT(*) as count 
            FROM fee_payments 
            WHERE status = 'pending'
        `);
        const pendingPayments = pendingResult.count || 0;

        res.json({
            members: {
                total: totalMembers,
                students: studentCount,
                breakdown: memberStats
            },
            rooms: {
                total: totalRooms,
                available: availableRooms,
                breakdown: roomStats
            },
            revenue: totalRevenue,
            pendingPayments
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDashboardStats };
