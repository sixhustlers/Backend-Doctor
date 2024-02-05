const { medicineSchema } = require("../model/doctorDetailsSchema");


const Medicine = mongoose.model("Medicine", medicineSchema);


exports.getMeds=async (req, res)=>{
    const doctor_id=req.params.doctor_id;
    try{
        const doc=await Medicine.findById(doctor_id);
        if(doc.freq_meds.length){
            const data= {
                status: "success",
                data: {
                    freqMeds: doc.freq_meds,
                    customMeds: doc.custom_meds
                }
            }
            res.status(200).json(data)
        }else res.status(200).json({noEntry : true})

    }catch(err){
        res.status(404).json({status:"fail", data: err})
    }
}

exports.updateMeds=async(req,res)=>{
    const doctor_id=req.params.doctor_id;
    try{
        const prescription=req.body.prescription;
        const freqMeds=(await Medicine.findById(doctor_id)).freq_meds;
        if(prescription.length){
            for(med of prescription){
            //  if(!freqMeds.indexOf(med.name)) freqMeds.push(med.name) OR
            if(freqMeds.every(item => item.toLowerCase() !== med.name.toLowerCase()))  freqMeds.push(med.name)
            }
        }

        const updatedDoc = await Medicine.findByIdAndUpdate(doctor_id, {freq_meds: freqMeds,custom_meds:req.body.custom_meds}, {
            new: true,
            runValidators: true,
          })

          const data= {
            status: "success",
            data: {
                freqMeds: updatedDoc.freq_meds,
                customMeds: updatedDoc.custom_meds
            }
        }
        res.status(200).json(data)

    }catch(err){
        res.status(400).json({status:"fail", data: err})
    }
}


