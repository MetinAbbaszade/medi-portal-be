const express = require('express');
const db = require('./db/ConnectDb.js');
const router = require('./routers/Hospital.js');
const cors = require("cors")

const app = express();
const PORT = 4000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))

app.use('/api/hospital', router)

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})