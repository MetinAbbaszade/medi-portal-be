const express = require('express');
const { getAllDoctors, getDoctorByDepartmentIdAndHospitalId, getDoctorsByTimeSlots } = require('../controllers/DoctorController');

const router = express.Router();


/**
 * @swagger
 * /api/doctors:
 *   get:
 *     tags:
 *       - Doctor
 *     summary: Get all doctors
 *     description: Retrieve a list of doctors.
 *     responses:
 *       200:
 *         description: All Doctors returned successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.get('/', getAllDoctors);


/**
 * @swagger
 * /api/doctors/{hospitalId}/departments/{departmentId}/doctors:
 *   get:
 *     tags:
 *       - Doctor
 *     summary: Get doctors by hospital and department
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctors returned successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Doctors not found
 *       500:
 *         description: Server Error
 */
router.get('/:hospitalId/departments/:departmentId/doctors', getDoctorByDepartmentIdAndHospitalId);


/**
 * @swagger
 * /api/doctors/getTimeSlots:
 *   post:
 *     tags:
 *       - Doctor
 *     summary: Get all time slots for a doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_id
 *               - date
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 format: uuid
 *                 example: "0314a3ec-b146-4cd7-b6bd-31e3536a6e5c"
 *                 description: UUID of the doctor
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-20"
 *                 description: Date for which time slots are requested (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of all time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "ff1c96f8-9239-11f0-aa79-48d03ec41d43"
 *                   doctor_id:
 *                     type: string
 *                     format: uuid
 *                     example: "0314a3ec-b146-4cd7-b6bd-31e3536a6e5c"
 *                   day:
 *                     type: string
 *                     example: "Mon"
 *                   start_time:
 *                     type: string
 *                     format: time
 *                     example: "09:00:00"
 *                   end_time:
 *                     type: string
 *                     format: time
 *                     example: "17:00:00"
 *                   slot_duration:
 *                     type: integer
 *                     example: 30
 *       400:
 *         description: Bad Request (missing or invalid parameters)
 *       404:
 *         description: No available time slots found
 *       500:
 *         description: Server Error
 */
router.post('/getTimeSlots', getDoctorsByTimeSlots)

module.exports = router;