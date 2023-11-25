const encrypt=require("mongoose-encryption");
const doctor_mongodb_url=process.env.DOCTER_MONGODB_URL;
const mongoose = require('mongoose');
const {authSchema} = require('../model/doctorSchema');
authSchema.plugin(encrypt, { secret:process.env.SECRET_KEY, encryptedFields: ['password'] });   //encrypt password field in database

const signup = async (req, res) => {      //signup function or password change function

    mongoose.connection.close();

    const auth = mongoose.model('auth', authSchema);

    const doctor_id = req.body.doctor_id;
    const password = req.body.password;
    const mobile_no = req.body.mobile_no;

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

    auth.find({username: doctor_id, password: password})             //check if doctor and password already exists
        .then( async (doctor) => {
            if (doctor.length === 0) {

                const doctor = new auth({
                    username: doctor_id,
                    password: password,
                    mobile_no: mobile_no,
                });

                await doctor.save()
                    .then(() => {
                        console.log('Doctor added to database');
                        res.status(200).json({ message: 'Doctor added to database' });
                    })
                    .catch((err) => {
                        console.log('Error adding doctor to database', err);
                        res.status(500).json({ message: 'Error adding doctor to database' });
                    }
                    );
            }
            else {
                console.log('Doctor already exists / Choose a different Username');
                res.status(409).json({ message: 'Choose a different Username' });
            }
        })


}




const login = async (req, res) => {

    mongoose.connection.close();
    
    const auth = mongoose.model('auth', authSchema);
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
            if (doctor[doctor.length-1].password === password) {                    //check if last updated password is correct
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