const BaseModel = require('./BaseModel');

class FeePayment extends BaseModel {
    constructor() {
        super('fee_payments');
    }

    async findByStudentId(studentId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE student_id = ? ORDER BY payment_date DESC`;
        const results = await this.db.query(sql, [studentId]);
        return results;
    }
}

module.exports = new FeePayment();
