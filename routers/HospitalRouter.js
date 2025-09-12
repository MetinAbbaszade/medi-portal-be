const express = require('express')
const { getAllHospitals } = require('../controllers/HospitalController')

const router = express.Router()

/**
 * @swagger
 * /api/hospital:
 *   get:
 *     tags:
 *       - Hospital
 *     summary: Get all hospitals
 *     description: Retrieve a list of hospitals. You can add optional query parameters to filter results.
 *     parameters:
 *       - in: query
 *         name: Name
 *         schema:
 *           type: string
 *         description: Filter hospitals by name
 *       - in: query
 *         name: SpecialtyId
 *         schema:
 *           type: string
 *         description: Filter hospitals by specialtyId
 *       - in: query
 *         name: Filter
 *         schema:
 *           type: string
 *         description: Filter hospitals
 *     responses:
 *       200:
 *         description: All hospitals returned successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.get('/', getAllHospitals);

module.exports = router;
