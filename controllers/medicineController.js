const { medicineSchema } = require('../models/doctorDetailsSchema')
const mongoose = require('mongoose')

const Medicine = mongoose.model('Medicines', medicineSchema)

exports.getMeds = async (req, res) => {
  const doctor_id = req.body.doctor_id
  try {
    const doctor = await Medicine.findOne({ doctor_id })
    if (doctor && (doctor.freq_meds.length || doctor.custom_meds.length)) {
      const data = {
        status: 'success',
        data: {
          freqMeds: doctor.freq_meds,
          customMeds: doctor.custom_meds,
        },
      }
      res.status(200).json(data)
    } else res.status(200).json({ noEntry: true })
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message })
  }
}

exports.updateMeds = async (req, res) => {
  const doctor_id = req.body.doctor_id
  try {
    const prescribedMedicines = req.body.prescribedMedicines
    const customMedicines = req.body.customMedicines

    const doctor = await Medicine.findOne({ doctor_id })

    if (!doctor) {
      const newMedicine = new Medicine({
        doctor_id,
        freq_meds: prescribedMedicines,
        custom_meds: customMedicines,
      })
      await newMedicine.save()
      res.status(200).json({
        status: 'success',
        data: {
          prescribedMedicines: newMedicine.freq_meds,
          customMedicines: newMedicine.custom_meds,
        },
      })
    } else {
      const customMeds = doctor.custom_meds
      const freqMeds = doctor.freq_meds

      if (prescribedMedicines.length) {
        for (med of prescribedMedicines) {
          //  if(!freqMeds.indexOf(med.name)) freqMeds.push(med.name) OR
          if (
            freqMeds.every((item) => item.toLowerCase() !== med.toLowerCase())
          )
            freqMeds.push(med.name)
        }
      }

      if (customMedicines.length) {
        for (med of customMedicines) {
          //  if(!freqMeds.indexOf(med.name)) freqMeds.push(med.name) OR
          if (
            customMeds.every((item) => item.toLowerCase() !== med.toLowerCase())
          )
            customMeds.push(med)
        }
      }

      await Medicine.findOneAndUpdate(
        { doctor_id },
        { custom_meds: customMeds, freq_meds: freqMeds },

        {
          new: true,
          runValidators: true,
        }
      )

      const data = {
        status: 'success',
        data: {
          prescribedMedicines: freqMeds,
          customMedicines: customMeds,
        },
      }
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(400).json({ status: 'fail', data: err.message })
  }
}
