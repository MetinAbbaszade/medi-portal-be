const express = require('express')
const { getAllHospitals, getHospitalByDepartmentId, updateHospital } = require('../controllers/HospitalController')

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

/**
 * @swagger
 * /api/hospital/{id}:
 *   put:
 *     tags:
 *       - Hospital
 *     summary: Update hospital by ID
 *     description: Update hospital details (including contacts, capacities, and addresses) by hospital ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: City Central Hospital
 *               type:
 *                 type: string
 *                 example: Public
 *               description:
 *                 type: string
 *                 example: Multi-specialty hospital with 24/7 emergency services.
 *               contacts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     phone:
 *                       type: string
 *                       example: "+994501234567"
 *                     email:
 *                       type: string
 *                       example: "info@hospital.az"
 *                     website:
 *                       type: string
 *                       example: "https://hospital.az"
 *               capacities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     beds:
 *                       type: integer
 *                       example: 200
 *                     icu_beds:
 *                       type: integer
 *                       example: 20
 *                     emergency_capacity:
 *                       type: integer
 *                       example: 50
 *               adresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                       example: "Nizami St 10"
 *                     city:
 *                       type: string
 *                       example: "Baku"
 *                     state:
 *                       type: string
 *                       example: "Absheron"
 *                     zip:
 *                       type: string
 *                       example: "AZ1000"
 *                     country:
 *                       type: string
 *                       example: "Nasimi"
 *             required:
 *               - name
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server Error
 */
router.put('/:id', updateHospital)



module.exports = router;
