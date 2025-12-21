const BaseModel = require('./BaseModel');

class Student extends BaseModel {
    constructor() {
        super('students');
    }

    async findByUserId(userId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
        const results = await this.db.query(sql, [userId]);
        return results[0];
    }
}

module.exports = new Student();
