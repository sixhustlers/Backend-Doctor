const router=require('express').Router();
const {greet}=require('../controllers/greet');
const {login,register,registerForm}=require('../controllers/authentication');

const {getAppointments}=require('../controllers/calendarEvents')

router.route('/').get(greet)
router.route('/login').post(login);
router.route('/register').post(register);
router.route('/registerForm').post(registerForm);

router.route('/getAppointments').get(getAppointments);

module.exports=router;