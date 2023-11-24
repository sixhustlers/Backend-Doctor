const doctor_mongodb_url=process.env.DOCTER_MONGODB_URL;
const mongoose = require('mongoose');
const authSchema = require('../model/doctorSchema');



const signup = async (req, res) => {

    mongoose.connection.close();

    const auth = mongoose.model('Doctor', authSchema);

    const doctor_id = req.body.doctor_id;
    const password = req.body.password;

    const connection = doctor_mongodb_url+doctor_id;
    console.log(connection);
    await mongoose.connect(connection)
        .then(() => {
            console.log('Connected to database');
        })
        .catch((err) => {
            console.log('Error connecting to database', err);
        }
    );

    const doctor = new auth({
        username: doctor_id,
        password: password,
    });

    await doctor.save()
        .then(() => {
            console.log('Doctor added to database');
            res.status(200).json({message: 'Doctor added to database'});
        })
        .catch((err) => {
            console.log('Error adding doctor to database', err);
            res.status(500).json({message: 'Error adding doctor to database'});
        }
    );

}




const login = async (req, res) => {

    mongoose.connection.close();
    
    const auth = mongoose.model('Doctor', authSchema);
    const doctor_id = req.body.doctor_id;
    const password = req.body.password;
    const connection = doctor_mongodb_url+doctor_id;
    console.log(connection);

    await mongoose.connect(connection)
        .then(() => {
            console.log('Connected to database');
        })
        .catch((err) => {
            console.log('Error connecting to database', err);
        }
    );

    await auth.find({username: doctor_id})
    .then((doctor) => {
        
        if (doctor.length === 0) {
            res.status(404).json({message: 'Doctor not found'});
        } 
        
        else {
            console.log('Doctor found');
            console.log(doctor);
            if (doctor[0].password === password) {
                console.log('Doctor authenticated');
                res.status(200).json({message: 'Doctor authenticated'});
            }
            else {
                res.status(401).json({message: 'Unauthorized'});
            }
        }

    });

}


module.exports = {login,signup};