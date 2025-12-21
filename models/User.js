const db = require('../config/database');

class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'student';
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.phone = data.phone;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const results = await db.query(sql, [email]);
            return results.length > 0 ? new User(results[0]) : null;
        } catch (error) {
            throw new Error('Error finding user by email: ' + error.message);
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const results = await db.query(sql, [id]);
            return results.length > 0 ? new User(results[0]) : null;
        } catch (error) {
            throw new Error('Error finding user by ID: ' + error.message);
        }
    }

    // Create new user
    async save() {
        try {
            const sql = `
                INSERT INTO users (email, password, role, first_name, last_name, phone, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            const params = [
                this.email,
                this.password,
                this.role,
                this.first_name,
                this.last_name,
                this.phone
            ];
            
            const result = await db.query(sql, params);
            this.id = result.insertId;
            return this;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Update user
    async update() {
        try {
            const sql = `
                UPDATE users 
                SET email = ?, role = ?, first_name = ?, last_name = ?, phone = ?, updated_at = NOW()
                WHERE id = ?
            `;
            const params = [
                this.email,
                this.role,
                this.first_name,
                this.last_name,
                this.phone,
                this.id
            ];
            
            await db.query(sql, params);
            return this;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    // Get all users (for admin)
    static async getAll() {
        try {
            const sql = 'SELECT id, email, role, first_name, last_name, phone, created_at, updated_at FROM users ORDER BY created_at DESC';
            const results = await db.query(sql);
            return results.map(user => new User(user));
        } catch (error) {
            throw new Error('Error fetching all users: ' + error.message);
        }
    }

    // Delete user
    static async delete(id) {
        try {
            const sql = 'DELETE FROM users WHERE id = ?';
            await db.query(sql, [id]);
            return true;
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }

    // Check if email exists
    static async emailExists(email, excludeId = null) {
        try {
            let sql = 'SELECT id FROM users WHERE email = ?';
            let params = [email];
            
            if (excludeId) {
                sql += ' AND id != ?';
                params.push(excludeId);
            }
            
            const results = await db.query(sql, params);
            return results.length > 0;
        } catch (error) {
            throw new Error('Error checking email existence: ' + error.message);
        }
    }

    // Get user profile data (without password)
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            role: this.role,
            first_name: this.first_name,
            last_name: this.last_name,
            phone: this.phone,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = User;