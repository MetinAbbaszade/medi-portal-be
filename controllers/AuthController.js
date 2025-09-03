const { mysqlDb: db } = require('../db/ConnectDB')
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'superunbelieveblecannotfindthissecretkey'

async function login(req, res) {
    const { email, password } = req.body

    try {
        const [users] = await db
            .promise()
            .query('SELECT * FROM users WHERE email = ?', [email])

        if (!users.length) return res.status(401).json({ message: 'Invalid email or password' });

        const user = users[0];

        if (user.password !== password) return res.status(401).json({ message: 'Invalid email or password' });

        const [[role]] = await db
            .promise()
            .query('SELECT * FROM roles WHERE id = ?', [user.role_id]);

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
            ...user,
            role: {
                id: role.id,
                name: role.name,
                modules
            }
        }
        delete payload.role_id;
        const token = jwt.sign(payload, JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { login }