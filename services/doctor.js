const { mysqlDb: db } = require("../db/ConnectDB");
const { fetchHospitalByHospitalId } = require('./hospital')

async function enrichDoctor(doctor) {
    // Departments
    const [departments] = await db
        .promise()
        .query(
            `
      SELECT dep.name, dep.id AS id, dep.icon AS icon 
      FROM doctor_departments dp
      INNER JOIN departments dep ON dep.id = dp.department_id
      WHERE dp.doctor_id = ?
      `,
            [doctor.id]
        );

    // Hospitals
    const [hospitals] = await db
        .promise()
        .query(
            `
      SELECT h.* 
      FROM doctor_hospitals dh
      INNER JOIN hospitals h ON h.id = dh.hospital_id
      WHERE dh.doctor_id = ?
      `,
            [doctor.id]
        );

    doctor.hospitals = [];
    for (let hospital of hospitals) {
        const hospital_detail = await fetchHospitalByHospitalId(hospital.id);
        doctor.hospitals.push(hospital_detail);
    }

    // Schedules
    const [schedules] = await db
        .promise()
        .query(
            `
      SELECT id, day_of_week, start_time, end_time 
      FROM doctor_schedule 
      WHERE doctor_id = ?
      `,
            [doctor.id]
        );

    // Specialties
    const [specialties] = await db
        .promise()
        .query(
            `
      SELECT s.id AS id, s.name AS name 
      FROM doctor_specialties ds 
      INNER JOIN specialties s ON ds.specialty_id = s.id 
      WHERE ds.doctor_id = ?
      `,
            [doctor.id]
        );

    // Attach data
    doctor.departments = departments;
    doctor.schedules = schedules;
    doctor.specialties = specialties;

    return doctor;
}

async function fetchAllDoctors() {
    try {
        const [doctors] = await db.promise().query(`SELECT * FROM doctors`);

        for (let doctor of doctors) {
            await enrichDoctor(doctor);
        }

        return doctors;
    } catch (error) {
        console.log(error);
    }
}

async function fetchDoctorById(id) {
    try {
        const [[doctor]] = await db
            .promise()
            .query(`SELECT * FROM doctors WHERE id = ?`, [id]);

        if (!doctor) return null;

        await enrichDoctor(doctor);

        return doctor;
    } catch (error) {
        console.log(error);
    }
}



module.exports = { enrichDoctor, fetchAllDoctors, fetchDoctorById };