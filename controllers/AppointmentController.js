const { mysqlDb: db } = require("../db/ConnectDB");
const { decodeToken } = require("../services/token");
const uuid = require('uuid')

async function addNewAppointment(req, res) {

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;
        if (!token) {
            res.status(401).json({ message: "I don't know who u are:D" })
        }

        const decoded_token = await decodeToken(token);
        const payload = {
            ...req.body,
            user_id: decoded_token.id,
            id: uuid.v4()
        };


        const keys = Object.keys(payload);
        const values = Object.values(payload);

        await db.promise().query(
            `INSERT INTO appointments (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
            values
        );

        res.status(201).json(payload);
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    addNewAppointment
}