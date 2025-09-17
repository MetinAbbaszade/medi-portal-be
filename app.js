const express = require('express');
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger.js");

const auth_router = require('./routers/Auth.js');
const hospital_router = require('./routers/HospitalRouter.js');
const contact_router = require('./routers/ContactRouter.js');
const department_router = require('./routers/Department.js');
const doctor_router = require('./routers/DoctorRouter.js');



const app = express();
const PORT = 4000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/api/auth', auth_router);
app.use('/api/hospital', hospital_router);
app.use('/api/contact', contact_router);
app.use('/api/departments', department_router);
app.use('/api/doctors', doctor_router);

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})

