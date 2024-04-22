const mongoose = require('mongoose');
const { eventsSchema,appointmentsSchema } = require('../models/calendarEventsSchema');
const { addEventToMatrix } = require('../controllers/doctorEvents');
exports.addNewEvent=async(req,res)=>{
    try{
        const {patient_id,
          patient_details,
          hospital_id_name,
          event_id,
          is_Patient_Diagnosed,
          doctor_id_name_department,
          temporary_symptoms_disease_id_name,
          event_type,}=req.body;

          console.log("hii")
        const doctor_id=doctor_id_name_department[0];
        const appointment_date=patient_details.time_slots.event_start;
        const event_start=patient_details.time_slots.event_start;
        const event_duration=patient_details.time_slots.event_duration;

        const event = mongoose.model('events', eventsSchema);
        const appointment=mongoose.model('appointments',appointmentsSchema);

        const new_event = new event({
            _id:event_id,
            doctor_id,
            event_type,
            event_desc:{
                actor_id_name:[patient_id,patient_details.name],
                place_id_name:hospital_id_name,
                // cause_id_name:temporary_symptoms_disease_id_name[0],
            },
            event_start,
            event_duration,
            event_color:'blue',
            is_event_completed:false,
        });
        await new_event.save();
        
        console.log("Event added successfully")

        patient_details["patient_id"]=patient_id;
        console.log(patient_details)
        const new_appointment = new appointment({
            _id:event_id,
            doctor_id:doctor_id_name_department[0],
            // patient_id,  //the patient_id is already present in the patient_details
            patient_details,
            appointment_date,
            hospital_id_name:hospital_id_name,
            system_symptoms_disease_id_name:temporary_symptoms_disease_id_name,
            is_Patient_Diagnosed,
        });
        await new_appointment.save();
        console.log("Appointment added successfully");

        // res.status(200).json({message:"Event and Appointment added successfully"});
        // updating the event in the event matrix
        
        await addEventToMatrix(
          doctor_id,
          event_start,
          event_duration,
          event_id,
          "reel",
          res
        );
        console.log("Event added to the matrix successfully");
    }
    catch(err)
    {
        console.log(err.message);
        res.status(500).json({meesage:err.message})
    }
}
