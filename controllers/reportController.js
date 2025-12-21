const db = require('../config/database');

const getMemberReport = async (req, res) => {
    try {
        const sql = `
            SELECT u.id, u.name, u.email, u.user_type, u.roll_number, 
                   s.department, s.year_of_study, s.phone 
            FROM users u 
            LEFT JOIN students s ON u.id = s.user_id
        `;
        const members = await db.query(sql);
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getFeeReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        let sql = `
            SELECT fp.*, u.name as student_name, u.roll_number 
            FROM fee_payments fp 
            JOIN users u ON fp.student_id = u.id 
        `;
        const params = [];
        if (startDate && endDate) {
            sql += ` WHERE fp.payment_date BETWEEN ? AND ?`;
            params.push(startDate, endDate);
        }
        sql += ` ORDER BY fp.payment_date DESC`;

        const payments = await db.query(sql, params);
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getOccupancyReport = async (req, res) => {
    try {
        const sql = `
            SELECT r.room_number, r.floor, r.capacity, r.status as room_status,
                   u.name as student_name, u.roll_number, ra.allocated_at
            FROM rooms r
            LEFT JOIN room_allocations ra ON r.id = ra.room_id AND ra.status = 'active'
            LEFT JOIN users u ON ra.student_id = u.id
            ORDER BY r.room_number
        `;
        const occupancy = await db.query(sql);
        res.json(occupancy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMemberReport,
    getFeeReport,
    getOccupancyReport
};
