const express = require('express');
const { addContact } = require('../controllers/ContactController');

const router = express.Router()


/**
 * @swagger
 * /api/contact:
 *   post:
 *     tags:
 *       - Contact Us
 *     summary: User's Contact
 *     description: User can send their objection and complaint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               message:
 *                 type: string
 *                 example: I have objection to you
 *     responses:
 *       200:
 *         description: Added successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server problem
 */
router.post('/', addContact)

module.exports = router;