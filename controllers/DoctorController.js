
// dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// const { date, doctor_id } = body;
// try {
//     const day = dayOfWeek[(new Date(date)).getDay() - 1];
//     if (!day) {
//         throw new Error('Appointments can only be booked Monday to Friday');
//     }
//     const [times] = await db
//         .promise()
//         .query(`
//             SELECT * FROM doctor_schedule AS d WHERE d.doctor_id = ? AND d.day_of_week = ?
//         `, [doctor_id, day])

//     res.status(200).json({ response: times });

// } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error })
// }


const { mysqlDb: db } = require("../db/ConnectDB");
const { fetchAllDoctors, fetchDoctorById } = require("../services/doctor");

async function getAllDoctors(_, res) {

    try {
        const doctors = await fetchAllDoctors()

        res.json({ doctors })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error });
    }
}

async function getDoctorByDepartmentIdAndHospitalId(req, res) {
    const response = [];
    const { hospitalId, departmentId } = req.params;
    try {
        const [doctors] = await db
            .promise()
            .query(
                `
            SELECT d.*
            FROM doctors d
            INNER JOIN doctor_hospitals dh ON d.id = dh.doctor_id
            INNER JOIN doctor_departments dd ON d.id = dd.doctor_id
            WHERE dh.hospital_id = ? AND dd.department_id = ?;
            `, [hospitalId, departmentId]
            )

        for (let doctor of doctors) {
            const doctor_detail = await fetchDoctorById(doctor.id);
            response.push(doctor_detail)
        }
        res.status(200).json({ response });
    } catch (error) {
        console.log(error);
    }
}

async function getDoctorsByTimeSlots({ body }, res) {

    const { doctor_id: doctorId, date } = body;
    try {
        const [dayOfWeekQuery] = await db
            .promise()
            .query(
                `SELECT DATE_FORMAT(?, '%a') AS day_of_week`, [date]
            );
        const dayOfWeek = dayOfWeekQuery[0].day_of_week;

        const [scheduleQuery] = await db
            .promise()
            .query(
                `SELECT start_time, end_time, slot_interval
            FROM doctor_schedule
            WHERE doctor_id = ? AND day_of_week = ?`,
                [doctorId, dayOfWeek]
            );

        if (!scheduleQuery.length) return res.json({ slots: [] });

        const { start_time, end_time, slot_interval } = scheduleQuery[0];

        const [bookedQuery] = await db
            .promise()
            .query(
                `SELECT TIME_FORMAT(time, '%H:%i') AS booked_time
     FROM appointments
     WHERE doctor_id = ? AND date = ?`,
                [doctorId, date]
            );

        const bookedSet = new Set(bookedQuery.map(a => a.booked_time));

        const generateSlots = (start, end, interval) => {
            let slots = [];

            let [h, m] = start.split(":").map(Number)
            const [eh, em] = end.split(":").map(Number)

            let current = h * 60 + m;
            let endOfDate = eh * 60 + em;

            while (current < endOfDate) {
                const hour = String(Math.floor(current / 60)).padStart(2, 0)
                const minutes = String(Math.floor(current % 60)).padStart(2, 0)
                const time = `${hour}:${minutes}`;

                slots.push({ time, available: !bookedSet.has(time) })
                current += interval;
            }

            return slots
        };

        const slots = generateSlots(start_time, end_time, slot_interval);

        res.json({ slots });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getAllDoctors, getDoctorByDepartmentIdAndHospitalId, getDoctorsByTimeSlots };