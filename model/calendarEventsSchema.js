const mongoose=require('mongoose');

const eventsSchema=new mongoose.Schema({
    event_type:{
        type:String,
        required:true,
    },

    event_name:{
        type:String,
    },
    event_desc:{
        type:String,
    },
    event_daystart:{
        type:Date,
        default:Date.now
    },
    event_dayend:{
        type:Date,
        
    },
    event_start:{
        type:Date,
    },
    event_end:{
        type:Date,
    },

    event_color:{
        type:String
    },

    //appointment event schema

    patient_unique_id:{
        type:String,
    },
    patient_name:{
        type:String,
    },
    disease_name:{
        type:String,
    },

})

module.exports={eventsSchema}