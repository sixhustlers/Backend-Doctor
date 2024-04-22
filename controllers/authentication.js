const mongoose = require('mongoose')
require('dotenv').config()

const {
  detailsSchema,
  authSchema,
} = require('../models/doctorDetailsSchema')

const encrypt = require('mongoose-encryption')
authSchema.plugin(encrypt, {
  secret: process.env.SECRET_KEY,
  encryptedFields: ['password'],
}) //encrypt password field in database


const register = async (req, res) => {
  //signup function or password change function
  console.log(req.body)
  const auth = mongoose.model('auth', authSchema)

  const doctor_id = req.body.doctor_id
  const password = req.body.password
  const mobile_no = req.body.mobile_no

  // const connection = doctor_mongodb_url+doctor_id;
  // console.log(connection);

  auth
    .find({ username: doctor_id, password: password }) //check if doctor and password already exists
    .then(async (doctor) => {
      if (doctor.length === 0) {
        const doctor = new auth({
          username: doctor_id,
          password: password,
          mobile_no: mobile_no,
        })

        await doctor
          .save()
          .then(() => {
            console.log('Doctor added to database')
            res.status(200).json({ message: 'Doctor added to database' })
          })
          .catch((err) => {
            console.log('Error adding doctor to database', err)
            res.status(500).json({ message: 'Error adding doctor to database' })
          })
      } else {
        console.log('Doctor already exists / Choose a different Username')
        res.status(409).json({ message: 'Choose a different Username' })
      }
    })
}

const registerForm = async (req, res) => {
  try {
    const {
      doctor_id,
      doctor_name,
      doctor_sex,
      doctor_dob,
      doctor_phone,
      doctor_email,
      doctor_specialization_id,
      doctor_qualification,
      doctor_exp,
      doctor_description,
      doctor_current_rating,
      doctor_current_hospital_id,
    } = req.body
    const dobarr = doctor_dob.split('/')
    const doctor_dob_year = dobarr[2]
    const doctor_dob_month = dobarr[1]
    const doctor_dob_date = dobarr[0]
    // console.log(doctor_dob_year,doctor_dob_month,doctor_dob_date)
    const exparr = doctor_exp.split('/')
    const doctor_exp_year = exparr[2]
    const doctor_exp_month = exparr[1]
    const doctor_exp_date = exparr[0]
    // console.log(doctor_exp_year,doctor_exp_month,doctor_exp_date)

    const exp = new Date(
      doctor_exp_year + '-' + doctor_exp_month + '-' + doctor_exp_date
    )
    const dob = new Date(
      doctor_dob_year + '-' + doctor_dob_month + '-' + doctor_dob_date
    )

    console.log('Experience:', new Date(exp.getTime() + 5.5 * 60 * 60 * 1000))
    console.log('DOB:', new Date(dob.getTime() + 5.5 * 60 * 60 * 1000))

    const details = mongoose.model('detail', detailsSchema)
    const detail = new details({
      doctor_id,
      doctor_name,
      doctor_sex,
      doctor_dob: new Date(dob.getTime() + 5.5 * 60 * 60 * 1000),
      doctor_phone,
      doctor_email,
      doctor_specialization_id,
      doctor_qualification,
      doctor_experience: new Date(exp.getTime() + 5.5 * 60 * 60 * 1000),
      doctor_description,
      doctor_current_rating,
      doctor_current_hospital_id,
    })
    await detail.save()
    console.log('Details added')
    res.status(200).json({ message: 'Details added successfully' })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  console.log(req.body)
  const auth = mongoose.model('auth', authSchema)
  const doctor_id = req.body.doctor_id
  const password = req.body.password

  // const connection = doctor_mongodb_url+doctor_id;
  // console.log(connection);

  await auth.find({ username: doctor_id }).then((doctor) => {
    if (doctor.length === 0) {
      res.status(404).json({ message: 'Doctor not found' })
    } else {
      console.log('Doctor found')
      console.log(doctor)
      if (doctor[doctor.length - 1].password === password) {
        //check if last updated password is correct
        console.log('Doctor authenticated')
        res.status(200).json({ message: 'Doctor authenticated' })
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    }
  })
}

module.exports = {
  login,
  register,
  registerForm,
}
