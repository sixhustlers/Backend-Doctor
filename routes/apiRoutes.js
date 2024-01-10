const router=require('express').Router();
const {greet}=require('../controllers/greet');
const {login,register,registerForm}=require('../controllers/authentication');

const {getAppointmentsForHomePage,getAppointmentsForAppointmentPage}=require('../controllers/getAppointments')

router.route('/').get(greet);
router.route('/login').post(login);
router.route('/register').post(register);
router.route('/registerForm').post(registerForm);

router.route('/homepage/getAppointments').get(getAppointmentsForHomePage);
router.route('/appointmentpage/getAppointments').get(getAppointmentsForAppointmentPage);

module.exports=router;