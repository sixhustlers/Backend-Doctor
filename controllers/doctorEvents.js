const mongoose = require('mongoose')

const {
  doctorHospitalsSchema,
} = require('../models/doctorDetailsSchema')
const { eventMatrixSchema } = require('../models/calendarEventsSchema')

// @desc Update the doctor's schedule
const updateDoctorSchedule = async (req, res) => {
  try {
    const doctor_id = req.params.doctor_id
    const hospitals_id_name_color_arr = req.body.hospitals_id_name_color
    const hospitals_locations_arr = req.body.hospitals_locations
    const hospitals_timings_arr = req.body.hospitals_timings
    const hospitals_days_arr = req.body.days
    const event_type=req.body.event_type

    const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)


    var week_schedule_arr=[];
    for(let i=0;i<7;i++){
      week_schedule_arr.push(new Array(1441).fill(null));
    }
    for(let i=0;i<hospitals_days_arr.length;i++){
      let start_time_arr = hospitals_timings_arr[i][0].split(':')
      let end_time_arr = hospitals_timings_arr[i][1].split(':')

      const start_time=new Date(today)
      const end_time=new Date(today)
      start_time.setUTCHours(start_time_arr[0],start_time_arr[1],0,0)
      end_time.setUTCHours(end_time_arr[0],end_time_arr[1],0,0)
      hospitals_timings_arr[i][0]=start_time;
      hospitals_timings_arr[i][1]=end_time;
      
      let start_time_value=parseInt(start_time_arr[0])*60+parseInt(start_time_arr[1]);
      let end_time_value=parseInt(end_time_arr[0])*60+parseInt(end_time_arr[1]);
      console.log(start_time_value,end_time_value)
      for(let j=start_time_value-1;j<end_time_value;j++){
        week_schedule_arr[hospitals_days_arr[i]][j]=event_type[i];
      }

     }


    const doctorSchedule = mongoose.model(
      'doctorSchedules', // although 'S' is capital ,but it's small in collection name
      doctorHospitalsSchema
    )

    //checking if the doctor has any previous schedule
    await doctorSchedule.findOneAndUpdate(
      { doctor_id: doctor_id, to: null },
      {
        to: new Date(today),
      }
    )

    // updating the new schedule of the doctor
    const new_schedule = new doctorSchedule({
      doctor_id,
      doctor_hospitals_id_name_color: hospitals_id_name_color_arr,
      doctor_hospitals_locations: hospitals_locations_arr,
      doctor_hospitals_timings: hospitals_timings_arr,
      doctor_hospitals_days: hospitals_days_arr,
      event_type:event_type,
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
      
      formAndUpdateEventMatrix(doctor_id, today, week_schedule_arr)

      res.status(200).json({ message: 'Schedule added' })
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
    }
  }
  
//   const formEventMatrix=async(doctor_id,date)=>{
//     try{
//       const today = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
//       // const newDelhiTime = new Date(today.getTime() + 5.5 * 60 * 60 * 1000)
//       today.setUTCHours(0, 0, 0, 0)
  
//       const tomorrow = new Date(today)
//       tomorrow.setUTCDate(date.getDate() + 1)
//       console.log(today, tomorrow)
  
//       // change the date to the first day of the month
//       const firstDayOfTheMonth = new Date(today)
//       firstDayOfTheMonth.setUTCDate(1)
  
//       const month = firstDayOfTheMonth.getMonth()
//       const year = firstDayOfTheMonth.getFullYear()
  
//       // to get the total number of days in that month
//       // Set the date to the first day of the next month
//       const firstDayOfNextMonth = new Date(year, month + 1, 1)
  
//       // Set the date to the last day of the current month minus one
//       const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth - 1)
  
//       // Get the day of the month from the last day of the current month
//       const totalDays = lastDayOfCurrentMonth.getDate()
//       console.log(totalDays, firstDayOfTheMonth)
  
//       const matrix = mongoose.model('eventMatrices', eventMatrixSchema)
//         const event_matrix = []
  
//         for (let i = 0; i <= totalDays; i++) {
//           const dayArray = new Array(1441).fill(null)
//           event_matrix.push(dayArray)
//         }
  
//         const new_matrix = new matrix({
//           doctor_id,
//           matrix_date: firstDayOfTheMonth,
//           event_matrix,
//         })
//         await new_matrix
//           .save()
//           .then(() => {
//             console.log('Matrix added')
//           })
//           .catch((err) => {
//             console.log(err.message)
//           })
  
//     }
//     catch(err){
//       console.log(err.message)
//       res.status(500).json({ message: err.message })
//     }
//   }

// const addEvent=async(doctor_id,date,event_time,event_duration)=>{
//   try{
//     const today = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
//     // const newDelhiTime = new Date(today.getTime() + 5.5 * 60 * 60 * 1000)
//     today.setUTCHours(0, 0, 0, 0)

//     const tomorrow = new Date(today)
//     tomorrow.setUTCDate(date.getDate() + 1)
//     console.log(today, tomorrow)

//     const matrix = mongoose.model('eventMatrices', eventMatrixSchema)

//     const existing_matrices = await matrix
//       .find({
//         doctor_id,
//         matrix_date: { $gte: today },
//       })
//       .sort({ matrix_date: 1 })

//     if (existing_matrices.length == 0) {
//       console.log('No matrix found')
//     } else {
//       const new_reel_matrix = existing_matrices[0].event_matrix.map((arr) =>
//         arr.slice()
//       )

//       const event_start_time = new Date(event_time)
//       const event_end_time = new Date(event_time)
//       event_start_time.setUTCSeconds(0)
//       event_end_time.setUTCSeconds(0)
//       event_end_time.setUTCMinutes(
//         event_end_time.getUTCMinutes() + event_duration
//       )

//       const start_time = event_start_time.getUTCHours() * 60 + event_start_time.getUTCMinutes()
//       const end_time = event_end_time.getUTCHours() * 60 + event_end_time.getUTCMinutes()

//       console.log(start_time, end_time)

//       for (let i = start_time; i < end_time; i++) {
//         new_reel_matrix[event_start_time.getUTCDate() - 1][i] = '1'
//       }

//       await matrix.findOneAndUpdate(
//         { _id: existing_matrices[0]._id },
//         {
//           event_matrix: new_reel_matrix,
//         }
//       )
//     }
//   } catch (err) {
//     console.log(err.message)
//     res.status(500).json({ message: err.message })
//   }
// }

const  formAndUpdateEventMatrix= async(doctor_id, date, week_schedule_arr)=> {
  try {
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

    const existing_matrices = await matrix
      .find({
        doctor_id,
        matrix_date: { $gte: firstDayOfTheMonth },
        matrix_type:'reel'
      })
      .sort({ matrix_date: 1 })

      console.log(existing_matrices.length)
    // generally this will occur when the doctor register for the very first time
    if (existing_matrices.length == 0) {

      createEventMatrix(doctor_id,date,week_schedule_arr);

    } 
    // for else condition only change the reel matrices not the real matrices
    else {
      // for the present month matrix
      if (today.getDate() != totalDays) {
        //if today is not the last day of the month
        const new_reel_matrix = existing_matrices[0].event_matrix.map((arr) =>
          arr.slice()
        )
        const day = existing_matrices[0].matrix_date.getDay()
        console.log(new_reel_matrix.length)
        // starting from the date of tomorrow
        for (let i = tomorrow.getDate() - 1; i < new_reel_matrix.length-1; i++) {
            new_reel_matrix[i]=week_schedule_arr[(day + i) % 7].slice();
          }
          console.log(new_reel_matrix[11])
        await matrix.findOneAndUpdate(
          { _id: existing_matrices[0]._id },
          {
            event_matrix: new_reel_matrix,
          }
        ).then(() => {
          console.log(`Matrix updated for ${existing_matrices[0].matrix_date}`)
        }
        ).catch((err) => {
          console.log(err.message)
        })
      }

      //for the rest of the months

      for (let i = 1; i < existing_matrices.length; i++) {
        const new_reel_matrix = existing_matrices[i].event_matrix.map((arr) =>
          arr.slice()
        )
        // console.log(new_reel_matrix)
        const day = existing_matrices[i].matrix_date.getDay()

        for (let j = 0; j < new_reel_matrix.length-1; j++) {
          new_reel_matrix[j]=week_schedule_arr[(day + j) % 7].slice();
        }

        await matrix
          .findOneAndUpdate(
            { _id: existing_matrices[i]._id },
            {
              event_matrix: new_reel_matrix,
            }
          )
          .then(() => {
            console.log(`Matrix updated for ${existing_matrices[i].matrix_date}`)
          })
          .catch((err) => {
            console.log(err.message)
          })
      }
    }
  } catch (err) {
    console.log(err.message)
  }
}

const createEventMatrix=async(doctor_id,date,week_schedule_arr)=>{
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

  // creating the reel matrix for the month
  const event_matrix_reel = []

  const day = firstDayOfTheMonth.getDay()
  for (let i = 0; i < totalDays; i++) {
    const dayArray = week_schedule_arr[(day + i) % 7].slice()
    event_matrix_reel.push(dayArray)
  }
  // event_matrix_reel.push(new Array(1441).fill(null)); // for the last extra array
  const matrix = mongoose.model('eventMatrices', eventMatrixSchema)
  const new_reel_matrix = new matrix({
    doctor_id,
    matrix_date: firstDayOfTheMonth,
    event_matrix: event_matrix_reel,
    matrix_type: 'reel',
  })
  await new_reel_matrix
    .save()
    .then(() => {
      console.log(`Reel Matrix updated for ${firstDayOfTheMonth}`)
    })
    .catch((err) => {
      console.log(err.message)
    })

  // creating the real matrix for the month
  const real_event_matrix = []
  for (let i = 0; i < totalDays; i++) {
    const dayArray = new Array(1440).fill(null)
    real_event_matrix.push(dayArray)
  }

  const new_real_matrix = new matrix({
    doctor_id,
    matrix_date: firstDayOfTheMonth,
    event_matrix: real_event_matrix,
    matrix_type: 'real',
  })
  await new_real_matrix
    .save()
    .then(() => {
      console.log(`Real Matrix updated for ${firstDayOfTheMonth}`)
    })
    .catch((err) => {
      console.log(err.message)
    })
} 

const addEventToMatrix=async(req,res)=>{
  //const addEventToMatrix=async(doctor_id,date,event_time,event_duration,event_id)
  try {
    const date = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
    const event_time = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
    const event_duration = req.body.event_duration
    const event_id = req.body.event_id
    const doctor_id = req.params.doctor_id
    const matrix_date = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
    matrix_date.setUTCHours(0, 0, 0, 0)
    matrix_date.setUTCDate(1)
    console.log(matrix_date)

    const matrix_row = date.getUTCDate() - 1
    const start_index =
      event_time.getUTCHours() * 60 + event_time.getUTCMinutes() //the event_time is already according to the IST
    const end_index = start_index + event_duration

    const matrix = mongoose.model('eventMatrices', eventMatrixSchema)

    var matrix_details = await matrix.find({
      doctor_id,
      matrix_date,
      matrix_type: 'reel',
    })

    //checking if there is any matrix for that month and if not then creating a event matrix
    if (matrix_details.length == 0) {
      console.log('No matrix found')
      const doctorSchedule = mongoose.model(
        'doctorSchedules',
        doctorHospitalsSchema
      )

      const doctor_schedule = await doctorSchedule.findOne({
        doctor_id,
        to: null,
      })

      const hospitals_id_name_color_arr =doctor_schedule.doctor_hospitals_id_name_color
      const hospitals_locations_arr = doctor_schedule.doctor_hospitals_locations
      const hospitals_timings_arr = doctor_schedule.doctor_hospitals_timings
      const hospitals_days_arr = doctor_schedule.doctor_hospitals_days
      const event_type = doctor_schedule.event_type

      // const today = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)

      var week_schedule_arr = []
      for (let i = 0; i < 7; i++) {
        week_schedule_arr.push(new Array(1441).fill(null))
      }

      for (let i = 0; i < hospitals_days_arr.length; i++) {
        let start_time =
          hospitals_timings_arr[i][0].getUTCHours() * 60 +
          hospitals_timings_arr[i][0].getUTCMinutes()
        let end_time =
          hospitals_timings_arr[i][1].getUTCHours() * 60 +
          hospitals_timings_arr[i][1].getUTCMinutes()

        for (let j = start_time - 1; j < end_time; j++) {
          week_schedule_arr[hospitals_days_arr[i]][j] = event_type[i]
        }
      }

      await createEventMatrix(doctor_id, new Date(), week_schedule_arr)

      matrix_details = await matrix.find({
        doctor_id,
        matrix_date,
        matrix_type: 'reel',
      })
    }

    console.log(matrix_details)
    const new_reel_matrix = matrix_details[0].event_matrix.map((arr) =>
      arr.slice()
    )

    for (let i = start_index; i <= end_index; i++) {
      new_reel_matrix[matrix_row][i] = event_id
    }

    await matrix.findOneAndUpdate(
      { _id: matrix_details[0]._id },
      {
        event_matrix: new_reel_matrix,
      }
    )

    res.status(200).json({ message: 'Event added successfully' })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}

const unScheduledEvent=async(req,res)=>{
  try{
    const doctor_id=req.params.doctor_id;
    const event_type=req.body.event_type;
    const event_description=req.body.event_description;
    const from=req.body.from;
    const to=req.body.to;

    if(event_type=="E")  //i.e any emergency patient or situation needed to be handled by the doctor,only inform those patients of that day
    {
      const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
      const matrix = mongoose.model('eventMatrices', eventMatrixSchema);

      const current_time=today.getUTCHours()*60+today.getUTCMinutes();
      
      const firstDayOfTheMonth = new Date(today)
      firstDayOfTheMonth.setUTCHours(0, 0, 0, 0)
      firstDayOfTheMonth.setUTCDate(1)
      const nextMonth = new Date(firstDayOfTheMonth)
      nextMonth.setUTCMonth(firstDayOfTheMonth.getUTCMonth()+1)
      nextMonth.setUTCDate(nextMonth.getUTCDate()-1)
      const totalDays = nextMonth.getUTCDate()


      const matrix_details = await matrix.find({doctor_id,matrix_date:{$gte:firstDayOfTheMonth,$lte:firstDayOfTheMonth}})

      const existing_matrix=matrix_details.event_matrix;

      const send_notification=[];
      for(let i=current_time;i<1441;i++){
        if(existing_matrix[today.getUTCDate()-1][i]!=null){
          send_notification.push(existing_matrix[today.getUTCDate()-1][i]);
        }
      }

      //also update the current_event slot 


      //send notification to the patients of that day along with the event_description
      //send_notification is the array of patient_id
      //use socket.io to send the information to the patients

      res.status(200).json({message:"Notification sent successfully"})
    }
  }
  catch(err)
  {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}


module.exports = { updateDoctorSchedule, formAndUpdateEventMatrix ,addEventToMatrix}