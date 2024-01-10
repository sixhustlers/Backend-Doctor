const mongoose=require('mongoose')
const {eventsSchema}=require('../model/calendarEventsSchema');
const ISODate=require('isodate')

const getAppointments=async(req,res)=>{
    try{
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
    const todays_date=new Date("2024-01-9");
    const allAppointments=await event.aggregate([
        {
    $match: {
      event_type: "appointment",
      event_daystart: { $gte: todays_date }
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

module.exports={getAppointments};