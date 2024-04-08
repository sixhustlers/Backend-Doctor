const mongoose = require('mongoose')
const ISODate = require('isodate')

const {
  detailsSchema,
  doctorHospitalsSchema,
} = require('../models/doctorDetailsSchema')

const { calendarEventsSchema } = require('../models/calendarEventsSchema')

const func = require('../controllers/authentication')

exports.doctorRecommenderSystemInfo = async (req, res) => {
  try {
    const { patient_location, visited_doctor_ids, booking_date } =
      req.body.constraints

    const booking_date_arr = booking_date.split('/')
    const booking_day = booking_date_arr[0]
    const booking_month = booking_date_arr[1]
    const booking_year = booking_date_arr[2]

    const date = ISODate(booking_year + '-' + booking_month + '-' + booking_day)

    const event_matrix_date = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)

    const current_time = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
    const event_matrix_day = event_matrix_date.getUTCDate()
    const event_matrix_hours = current_time.getUTCHours()
    const event_matrix_min = current_time.getUTCMinutes()

    // change the date to the first day of the month
    event_matrix_date.setUTCDate(1)
    event_matrix_date.setUTCHours(0, 0, 0, 0)

    const doctorDetails = mongoose.model('details', detailsSchema)
    const doctorHospitals = mongoose.model('hospitals', doctorHospitalsSchema)

    let radiusInKm = 25
    const pat_latitude = patient_location[0]
    const pat_longitude = patient_location[1]

    const doctors = await doctorHospitals.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [pat_longitude, pat_latitude], // Corrected order (longitude, latitude)
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      {
        $match: {
          distance: { $lte: radiusInKm * 1000 },
        },
      },
      {
        $sort: {
          distance: 1, // Sort in ascending order by distance
        },
      },
      {
        $group: {
          _id: '$doctor_id',
          nearestLocation: {
            $first: '$doctor_hospitals_locations',
          },
          distance: {
            $first: '$distance',
          },
        },
      },
    ])
 //not sure if this is the correct way to get the nearest location of the doctor

    console.log('Doctors within 25km:', doctors.length)

    const doctors_info = []

    doctors.map(async (doctor) => {
      let distance = calculateDistance(
        doctor.nearestLocation.coordinates[0],
        doctor.nearestLocation.coordinates[1],
        pat_latitude,
        pat_longitude
      )

      let doctorDetails = await doctorDetails.findOne({
        doctor_id: doctor.doctor_id,
      })

      const doctor_event_matrix = await eventMatrix.findOne({
        $match: {
          doctor_id: doctor.doctor_id,
          matrix_date: {
            $eq: event_matrix_date,
          },
        },
      }) 
      // calculating the patients in Queue upto that time
      var queue_length
      if (!doctor_event_matrix) {
        queue_length = 0
      } else {
        const matrix = doctor_event_matrix.event_matrix
        const lengthToCheck = event_matrix_hours * 60 + event_matrix_min
        const matrixIndex = event_matrix_day

        let count = 0
        let event_id = ''

        for (let i = 0; i < lengthToCheck; i++) {
          if (event_id != matrix[matrixIndex][i]) count++
        }
        queue_length = count
      }
      console.log(queue_length)

      // Checking if the patient has visited the doctor earlier
      let prev_visited;
      if(visited_doctor_ids.includes(doctor.doctor_id))
      {
        prev_visited=1;
      }
      else{
        prev_visited=0;
      }

      doctors_info.push({
        'Doctor ID': doctor.doctor_id,
        'Doctor Age':today.getFullYear() - doctorDetails.doctor_dob.getFullYear(),
        'Doctor Location': distance,
        'Doctor Type': doctorDetails.speciality,
        'Experience':today.getFullYear() - doctorDetails.doctor_years_of_experience.getFullYear(),
        'Patients in Lifetime': doctorDetails.doctor_total_appointments,
        'Patients in Queue': queue_length,
        'Pev_Visited': prev_visited
      })
    })

    res.status(200).json({ doctors_info })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance
}
