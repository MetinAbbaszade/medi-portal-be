const express = require('express');
const { addNewAppointment } = require('../controllers/AppointmentController');

const router = express.Router()

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags:
 *       - Appointment
 *     summary: Add new Appointment
 *     description: User can appoint any doctor they want
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospital_id
 *               - department_id
 *               - doctor_id
 *               - note
 *               - date
 *               - time
 *             properties:
 *               hospital_id:
 *                 type: string
 *                 example: HSP-003
 *               department_id:
 *                 type: string
 *                 example: DEP-101
 *               doctor_id:
 *                 type: string
 *                 example: 0314a3ec-b146-4cd7-b6bd-31e3536a6e5c
 *               note:
 *                 type: string
 *                 example: I have problems on my leg
 *               date:
 *                 type: string
 *                 example: 2025-09-22
 *               time:
 *                 type: string
 *                 example: 09:00:00
 *     responses:
 *       200:
 *         description: Added successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server problem
 */
router.post('/', addNewAppointment)

module.exports = router;