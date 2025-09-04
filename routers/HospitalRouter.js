const express = require('express')
const { getAllHospitals } = require('../controllers/HospitalController')

const router = express.Router()

router.get('/', getAllHospitals)


module.exports = router