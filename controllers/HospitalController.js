// const { mysqlDb: db } = require("../db/ConnectDB");
const { filterHospitals, fetchAllHospitals, fetchHospitalsByDepartmentId, fetchHospitalByHospitalId, updateHospitalService } = require("../services/hospital");

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
async function updateHospital({ body, params }, res) {
    const { id } = params;

    try {
        const updatedHospital = await updateHospitalService(id, body);

        return res.status(200).json({
            message: "Hospital updated successfully",
            hospital: updatedHospital,
        });
    } catch (error) {
        console.error(error);

        return res.status(error.status || 500).json({
            message: error.message || "Server error",
        });
    }
}


module.exports = {
    getAllHospitals,
    getHospitalByDepartmentId,
    updateHospital
}