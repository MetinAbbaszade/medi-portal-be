const { mysqlDb: db } = require("../db/ConnectDB")

async function getAllHospitals(req, res) {

    try {
        [hospitals] = await db
            .promise()
            .query(`SELECT * FROM hospitals`)

        for (let hospital of hospitals) {
            [adress] = await db
                .promise()
                .query(`
                    SELECT ha.street AS street, ha.city AS city, ha.state AS state, ha.zip AS zip, ha.country AS county 
                    from
                    hospital_addresses ha
                    JOIN hospitals h ON ha.hospital_id = h.id
                    WHERE hospital_id = ?
                    `, hospital.id);


            [capacities] = await db
                .promise()
                .query(`
                        SELECT beds, icu_beds, emergency_capacity
                        from
                        hospital_capacities hc
                        JOIN hospitals h ON hc.hospital_id = h.id
                        WHERE hospital_id = ?
                        `, hospital.id);

            [contacts] = await db
                .promise()
                .query(`
                SELECT phone, email, website
                        from
                        hospital_contacts hc
                        JOIN hospitals h ON hc.hospital_id = h.id
                        WHERE hospital_id = ?
                `, hospital.id);

            [departments] = await db
                .promise()
                .query(`
                 SELECT hd.head AS head, d.name AS name, d.icon AS icon FROM 
		hospital_departments hd
		JOIN hospitals h ON hd.hospital_id = h.id
        JOIN departments d ON d.id = hd.department_id
		WHERE hd.hospital_id = ?
                `, hospital.id);

            [specialties] = await db
                .promise()
                .query(
                    `
                SELECT s.id AS id, s.name AS name FROM 
		hospital_specialties hs
		JOIN hospitals h ON h.id = hs.hospital_id
        JOIN specialties s ON s.id = hs.specialty_id
        WHERE h.id= ?
                `, hospital.id)


            hospital.adresses = adress;
            hospital.capacities = capacities;
            hospital.contacts = contacts;
            hospital.departments = departments;
            hospital.specialties = specialties;
        }
        res.json({ hospitals });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

module.exports = {
    getAllHospitals
}