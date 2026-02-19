const { mysqlDb: db } = require("../db/ConnectDB");

function filterHospitals(query, hospitals) {
    if (query.Name) {
        hospitals = hospitals.filter(({ name }) => name.toLowerCase().includes(query.Name.toLowerCase()))
    }
    if (query.SpecialtyId) {
        hospitals = hospitals.filter(({ specialties }) =>
            specialties.some(({ name }) =>
                name.toLowerCase().includes(query.SpecialtyId.toLowerCase())
            )
        )
    }
    if (query.Filter) {
        switch (query.Filter) {
            case 'name-asc':
                hospitals.sort((hospital_a, hospital_b) =>
                    hospital_a.name.localeCompare(hospital_b.name)
                );
                break;
            case 'name-desc':
                hospitals.sort((hospital_a, hospital_b) =>
                    hospital_b.name.localeCompare(hospital_a.name)
                );
                break;
            default:
                break;
        }
    }

    return hospitals;
}

async function fetchAllHospitals() {
    try {

        [hospitals] = await db
            .promise()
            .query(`SELECT * FROM hospitals`)

        for (let hospital of hospitals) {
            [adress] = await db
                .promise()
                .query(`
                    SELECT ha.street AS street, ha.city AS city, ha.state AS state, ha.zip AS zip, ha.country AS country 
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
                 SELECT hd.head AS head, d.name AS name, d.icon AS icon, d.id AS id FROM 
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
                `, [hospital.id])


            hospital.adresses = adress;
            hospital.capacities = capacities;
            hospital.contacts = contacts;
            hospital.departments = departments
            hospital.specialties = specialties;
        }
        return hospitals;
    } catch (error) {
        throw new Error(error)
    }
}

async function fetchHospitalsByDepartmentId(id) {
    try {
        const hospitals = await fetchAllHospitals();
        return hospitals.filter(({ departments }) =>
            departments?.some(department => department.id.trim() === id.trim())
        );
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchHospitalByHospitalId(id) {
    try {
        const [[hospital]] = await db
            .promise()
            .query(`SELECT * FROM hospitals WHERE id = ?`, [id]);

        // ✅ Check hospital exists FIRST
        if (!hospital) {
            const err = new Error(`Hospital with id ${id} not found`);
            err.status = 404;
            throw err;
        }

        const [adresses] = await db.promise().query(`
            SELECT ha.street, ha.city, ha.state, ha.zip, ha.country AS county
            FROM hospital_addresses ha
            WHERE ha.hospital_id = ?
        `, [hospital.id]);

        const [capacities] = await db.promise().query(`
            SELECT beds, icu_beds, emergency_capacity
            FROM hospital_capacities
            WHERE hospital_id = ?
        `, [hospital.id]);

        const [contacts] = await db.promise().query(`
            SELECT phone, email, website
            FROM hospital_contacts
            WHERE hospital_id = ?
        `, [hospital.id]);

        const [departments] = await db.promise().query(`
            SELECT hd.head, d.name, d.icon, d.id
            FROM hospital_departments hd
            JOIN departments d ON d.id = hd.department_id
            WHERE hd.hospital_id = ?
        `, [hospital.id]);

        const [specialties] = await db.promise().query(`
            SELECT s.id, s.name
            FROM hospital_specialties hs
            JOIN specialties s ON s.id = hs.specialty_id
            WHERE hs.hospital_id = ?
        `, [hospital.id]);

        hospital.adresses = adresses || [];
        hospital.capacities = capacities || [];
        hospital.contacts = contacts || [];
        hospital.departments = departments || [];
        hospital.specialties = specialties || [];

        return hospital;

    } catch (error) {
        console.error("fetchHospitalByHospitalId error:", error);

        if (error.status) throw error;

        const err = new Error("Failed to fetch hospital data");
        err.status = 500;
        throw err;
    }
}

async function updateHospitalService(id, body) {
    const hospital = await fetchHospitalByHospitalId(id);
    const { contacts, capacities, adresses, ...hospitalFields } = body;

    const data = { ...hospitalFields, ...contacts[0], ...capacities[0], ...adresses[0] };

    for (let item in data) {
        if (!data[item] && data[item] !== 0) throw httpError(400, `Field ${item} is required and cannot be null`);
    }

    const hospitalKeys = Object.keys(hospitalFields);

    if (hospitalKeys.length > 0) {
        const setClause = hospitalKeys.map(k => `${k} = ?`).join(", ");
        const values = [...hospitalKeys.map(k => hospitalFields[k]), id];

        await db.promise().query(`
                UPDATE hospitals
                SET ${setClause}
                WHERE id = ?;
            `, values);
    }

    const contactKeys = Object.keys(contacts[0]);

    if (contactKeys.length > 0) {
        const setClause = contactKeys.map(c => `${c} = ?`).join(", ");
        const values = [...contactKeys.map(c => contacts[0][c]), id];


        await db.promise().query(`
            UPDATE hospital_contacts
            SET ${setClause}
            WHERE hospital_id = ?;
            `, values);
    }


    const capacityKeys = Object.keys(capacities[0]);

    if (capacityKeys.length > 0) {
        const setClause = capacityKeys.map(c => `${c} = ?`).join(", ");
        const values = [...capacityKeys.map(c => capacities[0][c]), id];


        await db.promise().query(`
            UPDATE hospital_capacities
            SET ${setClause}
            WHERE hospital_id = ?;
            `, values);
    }


    const addressKeys = Object.keys(adresses[0]);

    if (addressKeys.length > 0) {
        const setClause = addressKeys.map(a => `${a} = ?`).join(", ");
        const values = [...addressKeys.map(a => adresses[0][a]), id];


        await db.promise().query(`
            UPDATE hospital_addresses
            SET ${setClause}
            WHERE hospital_id = ?;
            `, values);
    }
}

function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}



module.exports = { filterHospitals, fetchAllHospitals, fetchHospitalsByDepartmentId, fetchHospitalByHospitalId, updateHospitalService };
