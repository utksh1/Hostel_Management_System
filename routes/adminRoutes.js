const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const memberController = require('../controllers/memberController');
const roomController = require('../controllers/roomController');
const feeController = require('../controllers/feeController');
const dashboardController = require('../controllers/dashboardController');
const reportController = require('../controllers/reportController');

// All routes here are protected and require admin role
router.use(protect, admin);

// Member Routes
router.get('/members', memberController.getMembers);
router.get('/members/:id', memberController.getMemberById);
router.post('/members', memberController.createMember);
router.put('/members/:id', memberController.updateMember);
router.delete('/members/:id', memberController.deleteMember);

// Room Routes
router.get('/rooms', roomController.getRooms);
router.post('/rooms', roomController.createRoom);
router.put('/rooms/:id', roomController.updateRoom);
router.delete('/rooms/:id', roomController.deleteRoom);

// Room Allocation Routes
router.get('/allocations', roomController.getRoomAllocations);
router.post('/allocations', roomController.createAllocation);
router.delete('/allocations/:id', roomController.deleteAllocation);

// Fee Routes
router.get('/fee-settings', feeController.getFeeSettings);
router.post('/fee-settings', feeController.createFeeSetting);
router.put('/fee-settings/:id', feeController.updateFeeSetting);
router.post('/fees/collect', feeController.collectFee);
router.get('/fees/payments', feeController.getPayments);

// Dashboard
router.get('/dashboard', dashboardController.getDashboardStats);

// Reports
router.get('/reports/members', reportController.getMemberReport);
router.get('/reports/fees', reportController.getFeeReport);
router.get('/reports/occupancy', reportController.getOccupancyReport);

module.exports = router;
