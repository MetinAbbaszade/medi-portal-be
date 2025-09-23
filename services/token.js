const jwt = require('jsonwebtoken');
const { mysqlDb: db } = require('../db/ConnectDB');

const JWT_SECRET = 'superunbelieveblecannotfindthissecretkey';

async function generateAccessToken(user_info) {
    console.log(user_info);
    try {

        const [[role]] = await db
            .promise()
            .query('SELECT * FROM roles WHERE id = ?', [user_info.role_id]);

        const [modules] = await db
            .promise()
            .query(`
                SELECT m.id AS id, m.name AS name   
                FROM modules m 
                JOIN role_modules rm ON m.id = rm.module_id
                WHERE rm.role_id = ? `, [role.id])

        for (let mod of modules) {
            const [permissions] = await db
                .promise()
                .query(`
                    SELECT p.id AS id, p.name AS name
                    FROM permissions p
                    JOIN module_permission mp ON p.id = mp.permission_id
                    WHERE mp.module_id = ?`, [mod.id])
            mod.permissions = permissions
        }


        const payload = {
            ...user_info,
            role: {
                id: role.id,
                name: role.name,
                modules
            }
        }
        delete payload.role_id;
        return jwt.sign(payload, JWT_SECRET)
    } catch (error) {
        throw error;
    }
}

async function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        throw new Error("Invalid or expired token");
    }
}



module.exports = { generateAccessToken, decodeToken };