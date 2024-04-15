const router = require('express').Router()
const { greet } = require('../controllers/greet')
const {
  login,
  register,
  registerForm,
} = require('../controllers/authentication')

const { updateDoctorSchedule,addEventToMatrix } = require('../controllers/doctorEvents')

const {
  getAppointmentsForHomePage,
  getAppointmentsForAppointmentPage,
} = require('../controllers/getAppointments')

const { getMeds, updateMeds } = require('../controllers/medicineController')

const {fetchDoctorsCardDetails,fetchDoctorDetails}=require('../controllers/patientBackendRequests')

const {doctorRecommenderSystemInfo}=require('../controllers/mlBackendRequests')

router.route('/').get(greet)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/registerForm').post(registerForm)

router.route('/addEvent/:doctor_id').post(addEventToMatrix)
router.route('/updateDoctorSchedule/:doctor_id').post(updateDoctorSchedule)

router.route('/homepage/getAppointments').get(getAppointmentsForHomePage)
router.route('/appointmentpage/getAppointments').get(getAppointmentsForAppointmentPage)

router.route('/getFrequentlyUsedMedicines').get(getMeds)
router.route('/updateFrequentlyUsedMedicines').post(updateMeds)

router.route('/fetchDoctorsCardDetails').post(fetchDoctorsCardDetails)
router.route('/fetchDoctorDetails').post(fetchDoctorDetails)

router.route('/doctorRecommenderSystemInfo').post(doctorRecommenderSystemInfo)

module.exports = router
