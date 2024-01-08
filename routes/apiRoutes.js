const router=require('express').Router();
const {greet}=require('../controllers/greet');
const {login,register}=require('../controllers/authentication');

router.route('/').get(greet)
router.route('/login').post(login);
router.route('/register').post(register);

module.exports=router;