const express = require('express');
const { getSpecialties } = require('../controllers/SpecialtyController');

const router = express.Router()

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     tags:
 *       - Specialty
 *     summary: Get all specialties
 *     description: Retrieve a list of specialties.
 *     responses:
 *       200:
 *         description: All specialties returned successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.get('/', getSpecialties);

module.exports = router;