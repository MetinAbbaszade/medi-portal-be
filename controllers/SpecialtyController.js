const { mysqlDb: db } = require("../db/ConnectDB");

async function getSpecialties(req, res) {
    try {
        const [specialties] = await db
            .promise()
            .query(`
            SELECT * FROM specialties;
            `)
        res.json({ specialties })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

module.exports = { getSpecialties };