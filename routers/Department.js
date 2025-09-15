const express = require('express');
const { getAllDepartments } = require('../controllers/DepartmentController');

const router = express.Router()

/**
 * @swagger
 * /api/departments:
 *   get:
 *     tags:
 *       - Department
 *     summary: Get all departments
 *     description: Retrieve a list of departments.
 *     responses:
 *       200:
 *         description: All Departments returned successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.get('/', getAllDepartments);

module.exports = router;