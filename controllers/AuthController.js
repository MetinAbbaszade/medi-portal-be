const { mysqlDb: db } = require('../db/ConnectDB')
const uuid = require('uuid');
const { generateAccessToken } = require('../models/token');

async function login(req, res) {
    const { email, password } = req.body

    try {
        const [users] = await db
            .promise()
            .query('SELECT * FROM users WHERE email = ?', [email])

        if (!users.length) return res.status(401).json({ message: 'Invalid email or password' });

        const user = users[0];

        if (user.password !== password) return res.status(401).json({ message: 'Invalid email or password' });

        const token = await generateAccessToken(user);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function register({ body }, res) {
    const payload = {
        ...body,
        id: uuid.v4(),
        role_id: 1
    };
    const columns = Object.keys(payload).join(', ');
    const placeholders = Object.keys(payload).map(() => "?").join(", ");

    try {
        await db
            .promise()
            .query(`INSERT INTO users (${columns}) VALUES (${placeholders})`, [...Object.values(payload)]);

        const token = await generateAccessToken(payload);
        res.status(201).json({ token })
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = { login, register }