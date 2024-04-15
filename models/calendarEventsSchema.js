const { ObjectId } = require('mongodb');
const mongoose=require('mongoose');

const eventsSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
  },
  // event_id:{
  //   type: ObjectId,
  //   required:true
  // }, 
  // use the _id as the event_id
  event_type: {
    enum: [
      'appointment',
      'emergency',
      'routine_visit',
      'lab_test',
      'vaccination',
      'medication',
      'surgery',
      'other',
    ],
  },

  event_desc: {
    actor_id_name: {
      //generally the actor_id will be the patient_id
      type: [String, String],
    },
    place_id_name: {
      //generally the place_id will be the hospital_id
      type: [String, String],
    },
    cause_id_name: {
      // generally the cause_name will be the disease_name
      type: [String, String],
    },
    
    event_info: {
      type: String,
    },
  },
  event_start: {
    type: Date,
  },
  event_end: {
    type: Date,
  },

  event_color: {
    type: String, // the color will be according to the event_type
  },

  is_event_completed: {
    type: Boolean,
    default: false,
  },
})

const eventMatrixSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
  },
  matrix_date: {
    type: Date, //always save the date as the first day of the month
    required: true,
  },
  // Assuming each element in the matrix is a String
  // 31*3600 matrix
  // initalize with null value while the doctor registers for the first time
  event_matrix: {
    type: [[String]],
    required: true,
  },
  matrix_type: {
    type: String,
    enum:['real','reel'],
    required:true
  },
})

const appointmentsSchema = new mongoose.Schema({
  //the event_id will be the appointment_id for the appointment event and it will be stored in _id;
  doctor_id: {
    type: String,
    required: true,
  },
  patient_details: {
    patient_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    sex: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
    },
    proffession: {
      type: String,
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    symptoms: {
      type: String,
    },
    
  },
  appointment_date: {
    type: Date,
  },
  prescription_details: {
    prescription_id: {
      type: ObjectId,
      required: true,
    },
    presciption_date: {
      type: String,
    },
    hospital_id_name: {
      type: [String, String],
    },
    prescription_json: {
      type: {},
      required: true,
    },
    lab_test_json: {
      type: {},
      required: true,
    },
  },
})

module.exports={eventsSchema,eventMatrixSchema,appointmentsSchema}