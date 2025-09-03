const express = require('express');
const cors = require("cors");
const auth_router = require('./routers/Auth.js');

const app = express();
const PORT = 4000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))

app.use('/api/auth', auth_router)

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})