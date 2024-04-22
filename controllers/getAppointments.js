const mongoose = require('mongoose')
const { eventsSchema } = require('../models/calendarEventsSchema')
const ISODate = require('isodate')
const moment = require('moment-timezone')

const getAppointmentsForHomePage = async (req, res) => {
  try {
    console.log(req.body)
    const { doctor_id, event_type } = req.body
    const event = mongoose.model('event', eventsSchema)

    // const newEvent=new event({
    //     doctor_id:"12345678",
    //     event_type:"appointment",
    //     event_name:"patinet appointment",
    //     event_daystart:moment().tz('Asia/Kolkata'),
    //     // event_daystart:new Date("2024-01-10T09:33:48.464Z"),
    //     patient_unique_id:11122211,
    //     patient_name:"kushal",
    //     disease_name:"Tooth pain"
    // })
    // await newEvent.save();

    const today = moment()
      .tz('Asia/Kolkata')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // Current date and time in local system timezone
    console.log(today)
    const allAppointments = await event.aggregate([
      {
        $match: {
          event_type,
          doctor_id,
          event_daystart: { $gte: today.toDate() },
          is_event_completed: false,
        },
      },
      {
        $group: {
          _id: {
            // year: { $year: "$event_daystart" },
            // month: { $month: "$event_daystart" },
            date: { $dayOfMonth: '$event_daystart' },
          },
          //   appointments: { $push: "$$ROOT" }
          appointments: {
            $push: {
              patient_unique_id: '$patient_unique_id',
              patient_name: '$patient_name',
              disease_name: '$disease_name',
              // event_daystart:"$event_daystart",
            },
          },
        },
      },
      {
        $sort: {
          //   "_id.year": 1,
          //   "_id.month": 1,
          '_id.date': 1,
        },
      },
    ])
    res.status(200).json({ allAppointments })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAppointmentsForAppointmentPage = async (req, res) => {
  try {
    console.log(req.body)
    const { doctor_id, event_type } = req.body

    const event = mongoose.model('event', eventsSchema)

    const today = moment()
      .tz('Asia/Kolkata')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // Current date and time in local system timezone;
    const tomorrow = moment(today)
      .add(1, 'day')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    console.log(today, tomorrow)

    const allAppointments = await event.aggregate([
      {
        $match: {
          event_type,
          event_daystart: {
            // $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            // $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            $gte: today.toDate(),
            $lt: tomorrow.toDate(),
          },
          is_event_completed: false,
          doctor_id,
        },
      },
      {
        $group: {
          _id: {
            // year: { $year: "$event_daystart" },
            // month: { $month: "$event_daystart" },
            date: { $dayOfMonth: '$event_daystart' },
            // date: { $dateToString: { format: "%Y-%m-%d", date: "$event_daystart" } }
          },

          appointments: {
            $push: {
              patient_unique_id: '$patient_unique_id',
              patient_name: '$patient_name',
              disease_name: '$disease_name',
              // event_daystart:"$event_daystart",
            },
          },
        },
      },
      {
        $sort: {
          //   "_id.year": 1,
          //   "_id.month": 1,
          '_id.date': 1,
        },
      },
    ])
    res.status(200).json({ allAppointments })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAppointmentsForHomePage,
  getAppointmentsForAppointmentPage,
}
