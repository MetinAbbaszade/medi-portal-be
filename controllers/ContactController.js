const { mysqlDb: db } = require("../db/ConnectDB");
const uuid = require('uuid')


async function addContact(req, res) {
    try {
        const payload = req.body;
        payload.id = uuid.v4();
        const columns = Object.keys(payload).join(', ')
        const placeholders = Object.keys(payload).map(() => "?").join(", ");
        await db
            .promise()
            .query(`
                INSERT INTO applies (${columns}) VALUES(${placeholders})
                `, [...Object.values(payload)])
        res.status(201).json({ payload });
    } catch (error) {
        res.status(501).json({ message: error });
    }
}

module.exports = {
    addContact
}