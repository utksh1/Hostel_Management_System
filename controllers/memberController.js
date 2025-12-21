const bcrypt = require('bcryptjs');
const db = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');

const getMembers = async (req, res) => {
    try {
        const users = await User.findAll();
        // Remove passwords
        const sanitizedUsers = users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
        res.json(sanitizedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMemberById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const { password, ...userData } = user;
            let result = { ...userData };

            if (user.user_type === 'student') {
                const student = await Student.findByUserId(user.id);
                if (student) {
                    result = { ...result, studentDetails: student };
                }
            }
            res.json(result);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createMember = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const {
            name, email, password, user_type, roll_number,
            department, year_of_study, phone, guardian_name,
            guardian_phone, address, gender, blood_group
        } = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            await connection.rollback();
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [userResult] = await connection.query(
            'INSERT INTO users (name, email, password, user_type, roll_number) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, user_type, roll_number]
        );
        const userId = userResult.insertId;

        if (user_type === 'student') {
            await connection.query(
                'INSERT INTO students (user_id, roll_number, department, year_of_study, phone, guardian_name, guardian_phone, address, gender, blood_group) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, roll_number, department, year_of_study, phone, guardian_name, guardian_phone, address, gender, blood_group]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Member created successfully', id: userId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        connection.release();
    }
};

const updateMember = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const id = req.params.id;
        const {
            name, email, user_type, roll_number,
            department, year_of_study, phone, guardian_name,
            guardian_phone, address, gender, blood_group
        } = req.body;

        // Basic user update
        await connection.query(
            'UPDATE users SET name = ?, email = ?, user_type = ?, roll_number = ? WHERE id = ?',
            [name, email, user_type, roll_number, id]
        );

        if (user_type === 'student') {
            // Check if student record exists
            const [students] = await connection.query('SELECT * FROM students WHERE user_id = ?', [id]);
            
            if (students.length > 0) {
                await connection.query(
                    'UPDATE students SET roll_number = ?, department = ?, year_of_study = ?, phone = ?, guardian_name = ?, guardian_phone = ?, address = ?, gender = ?, blood_group = ? WHERE user_id = ?',
                    [roll_number, department, year_of_study, phone, guardian_name, guardian_phone, address, gender, blood_group, id]
                );
            } else {
                // Create if missing (rare case but safe)
                await connection.query(
                    'INSERT INTO students (user_id, roll_number, department, year_of_study, phone, guardian_name, guardian_phone, address, gender, blood_group) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [id, roll_number, department, year_of_study, phone, guardian_name, guardian_phone, address, gender, blood_group]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Member updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

const deleteMember = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        if (result) {
            res.json({ message: 'Member removed' });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};
