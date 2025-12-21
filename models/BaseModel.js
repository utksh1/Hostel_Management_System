const db = require('../config/database');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = db;
    }

    async findAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        return await this.db.query(sql);
    }

    async findById(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const results = await this.db.query(sql, [id]);
        return results[0];
    }

    async create(data) {
        const fields = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
        const result = await this.db.query(sql, values);
        return result.insertId;
    }

    async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        values.push(id);
        
        const sql = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
        const result = await this.db.query(sql, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = await this.db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    async count() {
        const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
        const result = await this.db.query(sql);
        return result[0].count;
    }
}

module.exports = BaseModel;