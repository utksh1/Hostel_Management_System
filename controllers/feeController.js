const FeeSetting = require('../models/FeeSetting');
const FeePayment = require('../models/FeePayment');
const User = require('../models/User');
const db = require('../config/database');

const getFeeSettings = async (req, res) => {
    try {
        const settings = await FeeSetting.findAll();
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createFeeSetting = async (req, res) => {
    try {
        const id = await FeeSetting.create(req.body);
        res.status(201).json({ message: 'Fee setting created', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateFeeSetting = async (req, res) => {
    try {
        const result = await FeeSetting.update(req.params.id, req.body);
        if (result) {
            res.json({ message: 'Fee setting updated' });
        } else {
            res.status(404).json({ message: 'Setting not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const collectFee = async (req, res) => {
    const { student_id, amount, payment_method, month, year, fee_type } = req.body;
    try {
        const student = await User.findById(student_id);
        if (!student || student.user_type !== 'student') {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const receipt_number = 'REC-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const payment_date = new Date();
        
        // Calculate totals (simplified)
        const gst_amount = 0; // Can be calc based on logic
        const total_amount = amount; 

        const paymentId = await FeePayment.create({
            student_id,
            amount,
            gst_amount,
            total_amount,
            payment_date,
            payment_method,
            status: 'paid',
            receipt_number,
            month,
            year
        });

        res.status(201).json({ message: 'Fee collected', receipt_number, id: paymentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getPayments = async (req, res) => {
    try {
        const sql = `
            SELECT fp.*, u.name as student_name, u.roll_number 
            FROM fee_payments fp 
            JOIN users u ON fp.student_id = u.id 
            ORDER BY fp.payment_date DESC
        `;
        const payments = await db.query(sql);
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getFeeSettings,
    createFeeSetting,
    updateFeeSetting,
    collectFee,
    getPayments
};
