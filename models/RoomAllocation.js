const BaseModel = require('./BaseModel');

class RoomAllocation extends BaseModel {
    constructor() {
        super('room_allocations');
    }

    async findByStudentId(studentId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE student_id = ? AND status = 'active'`;
        const results = await this.db.query(sql, [studentId]);
        return results[0];
    }

    async findByRoomId(roomId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE room_id = ? AND status = 'active'`;
        return await this.db.query(sql, [roomId]);
    }
}

module.exports = new RoomAllocation();
