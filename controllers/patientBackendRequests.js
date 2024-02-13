const mongoose = require('mongoose')
const { detailsSchema } = require('../model/doctorDetailsSchema')

// Server2
exports.fetchDoctorsCardDetails = async (req, res) => {
  try {
    console.log(req.body)
    const doctors_ids = req.body.doctors_ids
    console.log(doctors_ids)
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
      arr.push(doctor_details.doctor_years_of_experience)
      arr.push(doctor_details.doctor_current_rating)
      response.push(arr)
      console.log(response)
    })

    await Promise.all(promises)

    res.status(200).json({ doctors_card_details: response })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: err.message })
  }
}
