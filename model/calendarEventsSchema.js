const { ObjectId } = require('mongodb');
const mongoose=require('mongoose');

const eventsSchema=new mongoose.Schema({
    doctor_id:{
        type:ObjectId],
        required:true,
    },
    event_type:{
        type:String,
        required:true,
    },
    event_name:{
        type:String, 
    },
    event_desc:{
        type:String, //for type="appointment" , event_desc is appoint desc obtained from the symptom form
    },
    event_start:{
        type:Date,
        default: Date.now
    },
    event_end:{
        type:Date,
    },

    event_color:{
        type:String
    },

    //appointment event schema

    is_event_completed:{
        type:Boolean,
        default:false
    },
    patient_id:{
        type:String,
    },
    disease_name:{
        type:String,
    },
})

module.exports={eventsSchema}