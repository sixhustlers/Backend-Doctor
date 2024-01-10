const mongoose=require('mongoose')
const {eventsSchema}=require('../model/calendarEventsSchema');
const ISODate=require('isodate')

const getAppointmentsForHomePage=async(req,res)=>{
    try{

      console.log(req.body);
      const {doctor_id,
            event_type,
      }=req.body;
    const event=mongoose.model('event',eventsSchema);

    // const newEvent=new event({
    //     event_type:"appointment",
    //     event_name:"patinet appointment",
    //     event_daystart:ISODate("2024-01-12"),
    //     patient_unique_id:11122211,
    //     patient_name:"Sanjay",
    //     disease_name:"Tooth pain"
    // })
    // await newEvent.save();
    const today= new Date(); // Current date and time in local system timezone
    today.setMinutes(today.getMinutes() + 330); // Adjust for IST (UTC+5:30)
    const allAppointments=await event.aggregate([
        {
    $match: {
      event_type,
      doctor_id,
      event_daystart: { $gte: today },
      is_event_completed: false,
    }
  },
  {
    $group: {
      _id: {
        // year: { $year: "$event_daystart" },
        // month: { $month: "$event_daystart" },
        date: { $dayOfMonth: "$event_daystart" }
      },
    //   appointments: { $push: "$$ROOT" }
        appointments: { $push:{
            patient_unique_id:"$patient_unique_id",
            patient_name:"$patient_name",
            disease_name:"$disease_name"

        }}
    }
  },
  {
    $sort: {
    //   "_id.year": 1,
    //   "_id.month": 1,
      "_id.date": 1
    }
  }
    ]);
    res.status(200).json({allAppointments});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}


const getAppointmentsForAppointmentPage=async(req,res)=>{
  try{
    console.log(req.body);
    const {doctor_id,
            event_type,
      }=req.body;

    const event=mongoose.model('event',eventsSchema);

    const today= new Date(); // Current date and time in local system timezone
today.setMinutes(today.getMinutes() + 330); // Adjust for IST (UTC+5:30)

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
    console.log(today,tomorrow);
    
    const allAppointments=await event.aggregate([
        {
    $match: {
      event_type,
      event_daystart: {
        // $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        // $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        $gte: today,
        $lt: tomorrow
      },
      is_event_completed:false,
      doctor_id
    }
  },
  {
    $group: {
      _id: {
        // year: { $year: "$event_daystart" },
        // month: { $month: "$event_daystart" },
        date: { $dayOfMonth: "$event_daystart" }
      },

        appointments: { $push:{
            patient_unique_id:"$patient_unique_id",
            patient_name:"$patient_name",
            disease_name:"$disease_name"
        }}
    }
  },
  {
    $sort: {
    //   "_id.year": 1,
    //   "_id.month": 1,
      "_id.date": 1
    }
  }
    ]);
    res.status(200).json({allAppointments});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={getAppointmentsForHomePage,getAppointmentsForAppointmentPage};