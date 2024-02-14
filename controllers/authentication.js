const mongoose = require('mongoose');
require('dotenv').config();
const {detailsSchema,authSchema} = require('../model/doctorDetailsSchema');
const encrypt=require("mongoose-encryption");
authSchema.plugin(encrypt, { secret:process.env.SECRET_KEY, encryptedFields: ['password'] });   //encrypt password field in database
const ISODate=require('isodate');

const register = async (req, res) => {      //signup function or password change function
    console.log(req.body);
    const auth = mongoose.model('auth', authSchema);

    const doctor_id = req.body.doctor_id;
    const password = req.body.password;
    const mobile_no = req.body.mobile_no;

    // const connection = doctor_mongodb_url+doctor_id;
    // console.log(connection);
    

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


const registerForm=async(req,res)=>{
    
    try{
        console.log(req.body);
        const {
        doctor_id,
        doctor_name,
        doctor_sex,
        doctor_dob_date,
        doctor_dob_month,
        doctor_dob_year,
        doctor_phone,
        doctor_email,
        doctor_specialization_id,
        doctor_qualification,
        doctor_years_of_experience,
        doctor_description,
        doctor_current_rating,
        doctor_current_hospital_id
    }=req.body;

    const details=mongoose.model('detail',detailsSchema);

    const detail=new details(
        {
        doctor_id,
        doctor_name,
        doctor_sex,
        doctor_dob:ISODate(doctor_dob_year+"-"+doctor_dob_month+"-"+doctor_dob_date),
        doctor_phone,
        doctor_email,
        doctor_specialization_id,
        doctor_qualification,
        doctor_years_of_experience,
        doctor_description,
        doctor_current_rating,
        doctor_current_hospital_id
        }
    )

    await detail.save();
        
        console.log("Details added");
    res.status(200).json({message:"Details added successfully"});
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}

const login = async (req, res) => {
    console.log(req.body);
    const auth = mongoose.model('auth',authSchema);
    const doctor_id = req.body.doctor_id;
    const password = req.body.password;

    // const connection = doctor_mongodb_url+doctor_id;
    // console.log(connection);

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


module.exports = {login,register,registerForm};