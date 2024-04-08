const mongoose = require('mongoose')

const {
  doctorHospitalsSchema,
} = require('../models/doctorDetailsSchema')
const { eventMatrixSchema } = require('../models/calendarEventsSchema')

// @desc    Update the doctor's schedule
const updateDoctorSchedule = async (req, res) => {
  try {
    const doctor_id = req.params.doctor_id
    const hospitals_id_name_color_arr = req.body.hospitals_id_name_color
    const hospitals_locations_arr = req.body.hospitals_locations
    const hospitals_timings_arr = req.body.hospitals_timings
    const hospitals_days_arr = req.body.days

    // const day_count_arr = new Array(7).fill(0) // storing the no. of schedule for each day

    const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)

    for (let i = 0; i < hospitals_timings_arr.length; i++) {
      const start_time_arr = hospitals_timings_arr[i][0].split(':')
      const end_time_arr = hospitals_timings_arr[i][1].split(':')

      const start_time = new Date(today)
      const end_time = new Date(today)

      start_time.setUTCHours(start_time_arr[0], start_time_arr[1], 0, 0)
      end_time.setUTCHours(end_time_arr[0], end_time_arr[1], 0, 0)
      hospitals_timings_arr[i][0] = start_time
      hospitals_timings_arr[i][1] = end_time

      // console.log(start_time, end_time)

      // day_count_arr[hospitals_days_arr[i]] += 1  // not adding the extra no. of cell as to keep the delay in event time, will count the delay in a single cell
    }

    const doctorSchedule = mongoose.model(
      'doctorSchedules', // although 'S' is capital ,but it's small in collection name
      doctorHospitalsSchema
    )

    //checking if the doctor has any previous schedule
    const existing_schedule = await doctorSchedule.findOneAndUpdate(
      { doctor_id: doctor_id, to: null },
      {
        to: new Date(today),
      }
    )
    console.log(existing_schedule)

    // updating the new schedule of the doctor
    const new_schedule = new doctorSchedule({
      doctor_id,
      doctor_hospitals_id_name_color: hospitals_id_name_color_arr,
      doctor_hospitals_locations: hospitals_locations_arr,
      doctor_hospitals_timings: hospitals_timings_arr,
      doctor_hospitals_days: hospitals_days_arr,
      from: new Date(today),
      to: null,
    })

    await new_schedule
      .save()
      .then(() => {
        console.log('New Schedule added')
      })
      .catch((err) => {
        console.log(err.message)
        res.status(500).json({ message: err.message })
      })
      
      res.status(200).json({ message: 'Schedule added' })
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
    }
  }
  
  const formEventMatrix=async(doctor_id,date)=>{
    try{
      const today = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
      // const newDelhiTime = new Date(today.getTime() + 5.5 * 60 * 60 * 1000)
      today.setUTCHours(0, 0, 0, 0)
  
      const tomorrow = new Date(today)
      tomorrow.setUTCDate(date.getDate() + 1)
      console.log(today, tomorrow)
  
      // change the date to the first day of the month
      const firstDayOfTheMonth = new Date(today)
      firstDayOfTheMonth.setUTCDate(1)
  
      const month = firstDayOfTheMonth.getMonth()
      const year = firstDayOfTheMonth.getFullYear()
  
      // to get the total number of days in that month
      // Set the date to the first day of the next month
      const firstDayOfNextMonth = new Date(year, month + 1, 1)
  
      // Set the date to the last day of the current month minus one
      const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth - 1)
  
      // Get the day of the month from the last day of the current month
      const totalDays = lastDayOfCurrentMonth.getDate()
      console.log(totalDays, firstDayOfTheMonth)
  
      const matrix = mongoose.model('eventMatrices', eventMatrixSchema)
        const event_matrix = []
  
        for (let i = 0; i <= totalDays; i++) {
          const dayArray = new Array(1441).fill(null)
          event_matrix.push(dayArray)
        }
  
        const new_matrix = new matrix({
          doctor_id,
          matrix_date: firstDayOfTheMonth,
          event_matrix,
        })
        await new_matrix
          .save()
          .then(() => {
            console.log('Matrix added')
          })
          .catch((err) => {
            console.log(err.message)
          })
  
    }
    catch(err){
      console.log(err.message)
      res.status(500).json({ message: err.message })
    }
  }



// const  formAndUpdateEventMatrix= async(doctor_id, date, day_count_arr)=> {
//   try {
//     const today = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
//     // const newDelhiTime = new Date(today.getTime() + 5.5 * 60 * 60 * 1000)
//     today.setUTCHours(0, 0, 0, 0)

//     const tomorrow = new Date(today)
//     tomorrow.setUTCDate(date.getDate() + 1)
//     console.log(today, tomorrow)

//     // change the date to the first day of the month
//     const firstDayOfTheMonth = new Date(today)
//     firstDayOfTheMonth.setUTCDate(1)

//     const month = firstDayOfTheMonth.getMonth()
//     const year = firstDayOfTheMonth.getFullYear()

//     // to get the total number of days in that month
//     // Set the date to the first day of the next month
//     const firstDayOfNextMonth = new Date(year, month + 1, 1)

//     // Set the date to the last day of the current month minus one
//     const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth - 1)

//     // Get the day of the month from the last day of the current month
//     const totalDays = lastDayOfCurrentMonth.getDate()
//     console.log(totalDays, firstDayOfTheMonth)

//     const matrix = mongoose.model('eventMatrices', eventMatrixSchema)

//     const existing_matrices = await matrix
//       .find({
//         doctor_id,
//         matrix_date: { $gte: firstDayOfTheMonth },
//       })
//       .sort({ matrix_date: 1 })

//     // console.log(existing_matrices)

//     // generally this will occur when the doctor register for the very first time
//     if (existing_matrices.length == 0) {
//       const event_matrix = []

//       const day = firstDayOfTheMonth.getDay()
//       for (let i = 0; i <= totalDays; i++) {
//         const dayArray = new Array(1441).fill(null)
//         // for (let j = 0; j < day_count_arr[(day + i) % 7]; j++) {
//         //   dayArray.push('0')
//         // }     // not adding the extra no. of cell as to keep the delay in event time, will count the delay in a single cell
//         event_matrix.push(dayArray)
//       }

//       const new_matrix = new matrix({
//         doctor_id,
//         matrix_date: firstDayOfTheMonth,
//         event_matrix,
//       })
//       await new_matrix
//         .save()
//         .then(() => {
//           console.log('Matrix added')
//         })
//         .catch((err) => {
//           console.log(err.message)
//         })
//     } else {
//       // for the present month matrix
//       if (today.getDate() != totalDays) {
//         //if today is not the last day of the month
//         const new_event_matrix = existing_matrices[0].event_matrix.map((arr) =>
//           arr.slice()
//         )
//         const day = existing_matrices[0].matrix_date.getDay()

//         // starting from the date of tomorrow
//         for (let i = tomorrow.getDate() - 1; i < new_event_matrix.length; i++) {
//           const diff =
//             new_event_matrix[i].length - (1440 + day_count_arr[(day + i) % 7])

//           if (diff < 0) {
//             for (let j = 0; j < diff; j++) {
//               new_event_matrix[i].push('0')
//             }
//           }
//           if (diff > 0) {
//             for (let j = 0; j < diff; j++) {
//               new_event_matrix[i].pop() // deletes the last index
//             }
//           }
//         }
//         console.log(new_event_matrix)
//         await matrix.findOneAndUpdate(
//           { _id: existing_matrices[0]._id },
//           {
//             event_matrix: new_event_matrix,
//           }
//         )
//       }

//       //for the rest of the months

//       for (let i = 1; i < existing_matrices.length; i++) {
//         const new_event_matrix = existing_matrices[i].event_matrix.map((arr) =>
//           arr.slice()
//         )
//         // console.log(new_event_matrix)
//         const day = existing_matrices[i].matrix_date.getDay()

//         for (let j = 0; j < new_event_matrix.length; j++) {
//           const diff =
//             new_event_matrix[j].length - (1440 + day_count_arr[(day + j) % 7])
//           // console.log(diff, day_count_arr[(day + j) % 7])

//           if (diff < 0) {
//             for (let k = diff; k < 0; k++) {
//               new_event_matrix[j].push('0')
//             }
//           }
//           if (diff > 0) {
//             for (let k = diff; k > 0; k--) {
//               new_event_matrix[j].pop() // deletes the last index
//             }
//           }
//         }
//         // console.log(new_event_matrix)

//         await matrix
//           .findOneAndUpdate(
//             { _id: existing_matrices[i]._id },
//             {
//               event_matrix: new_event_matrix,
//             }
//           )
//           .then(() => {
//             console.log('Matrix updated')
//           })
//           .catch((err) => {
//             console.log(err.message)
//           })
//       }
//     }
//   } catch (err) {
//     console.log(err.message)
//     res.status(500).json({ message: err.message })
//   }
// }

module.exports = { updateDoctorSchedule, formEventMatrix }