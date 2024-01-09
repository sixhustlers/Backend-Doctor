const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required:true,
    },
    mobile_no: {
        type: String,
        required: true,
    }
    
});

const detailsSchema = new mongoose.Schema({

    doctor_id: {
        type: String,
        required: true,
    },
    doctor_name: {
        type: String,
        required: true,
    },
    doctor_sex: {
        type: String,
        required: true,
    },
    doctor_dob: {
        type: Date,
        required: true,
        default:Date.now,
    },
    doctor_phone: {
        type: String,
        required: true,
    },
    doctor_email: {
        type: String,
    },
    doctor_specialization_id: {
        type: String,
        required: true,
    },
    doctor_qualification: {
        type: String,
        required: true,
    },
    doctor_years_of_experience: {
        type: String,
        required: true,
    },
    doctor_description:{
        type:String,

    }

});

const appointmentsSchema = new mongoose.Schema({

    patient_id: {
        type: String,
        required: true,
    },
    appointment_data: {
        type: Date,
        required: true,
    },
    prescription_id: {
        type: String,
        required: true,
    },
    hospital_id: {
        type: String,
        required: true,
    },

});

const prescriptionsSchema = new mongoose.Schema({

    disease_id: {
        type: String,
        required: true,
    },
    track_id: {
        type: String,
        required: true,
    },
    prescription_id: {
        type: String,
        required: true,
    },
    presciption_date: {
        type: String,
        required: true,
    },
    prescription_json: {
        type: {},
        required: true,
    },
    lab_test_json: {
        type: {},
        required: true,
    },
    doctor_id: {
        type: String,
        required: true,
    },
    doctor_name: {
        type: String,
        required: true,
    },
    doctor_speciality: {
        type: String,
        required: true,
    },
    hospital_id: {
        type: String,
        required: true,
    },
    hospital_name: {
        type: String,
        required: true,
    }

});

const hospitalsSchema = new mongoose.Schema({

    hospital_id: {
        type: String,
        required: true,
    },
    hospital_name: {
        type: String,
        required: true,
    },
    contract_type_id: {
        type: String,
        required: true,
    }

});

const timetableSchema = new mongoose.Schema({

});





module.exports={authSchema,detailsSchema,appointmentsSchema,prescriptionsSchema,hospitalsSchema,timetableSchema};
