const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config();

const mongoose = require('mongoose');
const doctor_mongodb_url=process.env.DOCTOR_MONGODB_URL;

const routes= require('./routes/apiRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', routes);


app.listen(port, async() => {

    await mongoose.connect(doctor_mongodb_url)
        .then(() => {
            console.log('Connected to database');
        })
        .catch((err) => {
            console.log('Error connecting to database', err);
        }
    );
    console.log('Server is running at port ' + port);
});