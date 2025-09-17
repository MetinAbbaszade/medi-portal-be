const { mysqlDb: db } = require("../db/ConnectDB");
const { filterHospitals, fetchAllHospitals, fetchHospitalsByDepartmentId } = require("../services/hospital");

async function getAllHospitals(req, res) {
    let filteredHospitals = [], hospitals = [];
    try {
        hospitals = await fetchAllHospitals()
        filteredHospitals = Object.keys(req.query).length !== 0 ? filterHospitals(req.query, hospitals) : hospitals;
        res.json({ filteredHospitals });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

async function getHospitalByDepartmentId(req, res) {
    let hospitals = [];

    try {
        hospitals = await fetchHospitalsByDepartmentId(req.params.id);
        res.json({ hospitals });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

module.exports = {
    getAllHospitals,
    getHospitalByDepartmentId
}