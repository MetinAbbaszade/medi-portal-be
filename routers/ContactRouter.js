const express = require('express');
const { addContact } = require('../controllers/ContactController');

const router = express.Router()

router.post('/', addContact)

module.exports = router;