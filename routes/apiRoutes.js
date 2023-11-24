const router=require('express').Router();
const {greet}=require('../controllers/greet');
const {login,signup}=require('../controllers/authentication');

router.route('/').get(greet)
router.route('/login').post(login);
router.route('/signup').post(signup);

module.exports=router;