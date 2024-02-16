const mongoose = require('mongoose');

// exports.addNewPatient = async (req, res) => {
//     try {
//         const {
//         name,
//         age
//     } = req.body;
//     const patient = mongoose.model('patients', patientSchema);
//     const new_patient = new patient({
//         name,
//         age
//     });
//     await new_patient.save();
//     res.status(200).json({ message: 'Patient Added' });
//     }
//     catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
