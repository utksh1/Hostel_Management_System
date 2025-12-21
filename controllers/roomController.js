const Room = require('../models/Room');
const RoomAllocation = require('../models/RoomAllocation');
const User = require('../models/User');
const db = require('../config/database');

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createRoom = async (req, res) => {
    const { room_number, floor, capacity, status } = req.body;
    try {
        const existingRoom = await Room.findByRoomNumber(room_number);
        if (existingRoom) {
            return res.status(400).json({ message: 'Room number already exists' });
        }

        const roomId = await Room.create({
            room_number, floor, capacity, status: status || 'available'
        });
        res.status(201).json({ message: 'Room created', id: roomId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateRoom = async (req, res) => {
    const id = req.params.id;
    const { room_number, floor, capacity, status } = req.body;
    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if room number is taken by another room
        if (room_number !== room.room_number) {
            const existingRoom = await Room.findByRoomNumber(room_number);
            if (existingRoom) {
                return res.status(400).json({ message: 'Room number already exists' });
            }
        }

        await Room.update(id, { room_number, floor, capacity, status });
        res.json({ message: 'Room updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const result = await Room.delete(req.params.id);
        if (result) {
            res.json({ message: 'Room deleted' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRoomAllocations = async (req, res) => {
    try {
        const sql = `
            SELECT ra.*, u.name as student_name, r.room_number 
            FROM room_allocations ra 
            JOIN users u ON ra.student_id = u.id 
            JOIN rooms r ON ra.room_id = r.id
        `;
        const allocations = await db.query(sql);
        res.json(allocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createAllocation = async (req, res) => {
    const { student_id, room_id } = req.body;
    try {
        // Check if student exists
        const student = await User.findById(student_id);
        if (!student || student.user_type !== 'student') {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        // Check if room exists and is available
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (room.status !== 'available') {
            return res.status(400).json({ message: 'Room is not available' });
        }

        // Check capacity
        const currentAllocations = await RoomAllocation.findByRoomId(room_id);
        if (currentAllocations.length >= room.capacity) {
            return res.status(400).json({ message: 'Room is full' });
        }

        // Check if student already allocated
        const existingAllocation = await RoomAllocation.findByStudentId(student_id);
        if (existingAllocation) {
            return res.status(400).json({ message: 'Student already allocated a room' });
        }

        await RoomAllocation.create({ student_id, room_id, status: 'active' });

        // Update room status if full
        if (currentAllocations.length + 1 >= room.capacity) {
            await Room.update(room_id, { status: 'occupied' }); // Or stay available if you want to fill to capacity? Usually 'occupied' implies full or taken. 
            // Actually, let's keep it simple. If capacity reached, maybe mark as occupied? 
            // But 'occupied' might mean "at least one person".
            // Let's stick to: if (currentAllocations.length + 1 >= room.capacity) update status to 'occupied'
             await Room.update(room_id, { ...room, status: 'occupied' });
        }
        
        // Re-read room to ensure we don't overwrite fields, create method takes all fields? No, update takes object.
        // Wait, my update method overwrites all fields provided?
        // models/BaseModel.js:
        // const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        // So it only updates provided fields. Good.
        // But above I did: await Room.update(room_id, { ...room, status: 'occupied' });
        // `room` variable is the DB result, which has created_at etc. I should only pass status.
        if (currentAllocations.length + 1 >= room.capacity) {
             await Room.update(room_id, { status: 'occupied' });
        }

        res.status(201).json({ message: 'Room allocated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAllocation = async (req, res) => {
    try {
        const allocation = await RoomAllocation.findById(req.params.id);
        if (!allocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        await RoomAllocation.delete(req.params.id);
        
        // Update room status to available
        await Room.update(allocation.room_id, { status: 'available' });

        res.json({ message: 'Allocation removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomAllocations,
    createAllocation,
    deleteAllocation
};
