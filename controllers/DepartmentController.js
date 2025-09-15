const { mysqlDb: db } = require("../db/ConnectDB");

async function getAllDepartments(req, res) {
    try {
        const [departments] = await db
            .promise()
            .query(`
            SELECT * FROM departments;
            `)
        res.json({ departments })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

module.exports = { getAllDepartments };