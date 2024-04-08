const mongoose = require('mongoose')
const { detailsSchema } = require('../models/doctorDetailsSchema')

exports.fetchDoctorsCardDetails = async (req, res) => {
  try {
    console.log(req.body)
    const doctors_ids = req.body.doctors_ids
    // console.log(doctors_ids)
    const doctorDetails = mongoose.model('details', detailsSchema)
    const response = []

    const promises = doctors_ids.map(async (doctor) => {
      const doctor_details = await doctorDetails.findOne({
        doctor_id: doctor,
      })
      let arr = []
      arr.push(doctor)
      arr.push(doctor_details.doctor_name)
      arr.push(doctor_details.specialization)
      arr.push(
        new Date().getYear() - doctor_details.doctor_experience.getYear()
      )
      arr.push(doctor_details.doctor_current_rating)
      await response.push(arr)
      // console.log(response)
    })
    await Promise.all(promises)
    // while map itself doesn't return a promise, 
    //the callback function's use of async and the asynchronous operations inside it result in an array of promises
    console.log(response)

    res.status(200).json({ doctors_card_details: response })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message })
  }
}

exports.fetchDoctorDetails = async (req, res) => {
  try {
    const { doctor_id } = req.body
    const doctorDetails = mongoose.model('details', detailsSchema)
    const doctor_details = await doctorDetails.findOne({ doctor_id })
    res.status(200).json({ doctor_details, time_slots: 'to be figured out' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
