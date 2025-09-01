const mysql = require('mysql2')

function connectDB() {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'M3tin190534--',
        database: 'medi_portal_db'
    })

    db.connect(err => {
        if (err) throw err;
        console.log("MySQL Connected");
    })

    return db;
}

const mysqlDb = connectDB()

module.exports = mysqlDb;
