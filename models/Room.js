const BaseModel = require('./BaseModel');

class Room extends BaseModel {
    constructor() {
        super('rooms');
    }

    async findByRoomNumber(roomNumber) {
        const sql = `SELECT * FROM ${this.tableName} WHERE room_number = ?`;
        const results = await this.db.query(sql, [roomNumber]);
        return results[0];
    }
}

module.exports = new Room();
