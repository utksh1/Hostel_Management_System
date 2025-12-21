const BaseModel = require('./BaseModel');

class User extends BaseModel {
    constructor() {
        super('users');
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const results = await this.db.query(sql, [email]);
        return results[0];
    }
}

module.exports = new User();
