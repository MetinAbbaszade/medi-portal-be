const express = require('express')
const { getAllHospitals, getHospitalByDepartmentId } = require('../controllers/HospitalController')

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
 *       - in: query
 *         name: SpecialtyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: Filter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospitals returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filteredHospitals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
router.get('/', getAllHospitals);


/**
 * @swagger
 * /api/hospital/{id}:
 *   get:
 *     tags:
 *       - Hospital
 *     summary: Get hospital by department ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hospital:
 *                   $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server Error
 */
router.get('/:id', getHospitalByDepartmentId);



module.exports = router;
