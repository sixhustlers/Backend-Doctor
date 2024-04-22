const { ObjectId, Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile_no: {
    type: String,
    required: true,
  },
})

const locationSchema = new mongoose.Schema({
  hospital_id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  coordinates: {
    type: [Number], // Assuming [latitude,longitude]
    index: '2dsphere',
    required: true,
  },
}) // schema of the hospital's location


const detailsSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
  },
  doctor_name: {
    type: String,
    required: true,
  },
  doctor_sex: {
    type: String,
    required: true,
  },
  doctor_dob: {
    type: Date,
    required: true,
  },
  doctor_phone: {
    type: String,
    required: true,
  },
  doctor_email: {
    type: String,
  },
  doctor_specialization: {
    type: [String],
    // enum: ['option1', 'option2', 'option3', 'option4'],
    // specs:[String], //array of strings
    required: true,
  },
  doctor_qualification: {
    type: [String],
    required: true,
  },
  doctor_experience: {
    type: Date,
    required: true,
  },
  doctor_description: {
    type: String,
  },
  // doctor_profile_picture: {
  //     type: String,
  // },

  // timely changeable data
  doctor_current_event:{
    event_id:{
      type: ObjectId,
    },
    from: {
      type: Date,
    },
  },
  
  doctor_current_rating: {
    type: Number,
  },
  doctor_total_appointments: {
    type: Number,
  },
  doctor_current_hospital_id_name: {
    type: [String],
  },
})


// schema of the doctor's hospital details and it's weekly schedule
const doctorHospitalsSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
  },
  doctor_hospitals_id_name_color: {
    type: [[String]],
  },
  doctor_hospitals_locations: {
    type: [locationSchema],
  },
  doctor_hospitals_timings: {
    type: [[Date]],
    required: true,
  },
  doctor_hospitals_days: {
    type: [Number],
  },
  event_type:{
    type:[String]
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
})

const medicineSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
  },
  custom_meds: {
    type: [String],
  },
  freq_meds: {
    type: [String],
  },
})

const feedbackSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
  },
  patient_name: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
})

module.exports = {
  authSchema,
  detailsSchema,
  medicineSchema,
  doctorHospitalsSchema,
  feedbackSchema,
}
