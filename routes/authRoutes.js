const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const passport = require('passport') ;
const uploadAvatar = require('../utils/uploadAvatar') ;

router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);
// router.post('/emailVerify', authController.emailVerify) ;
// router.post('/forgotCode', authController.forgotCode) ;
// router.post('/passwordChanged', authController.passwordChanged) ;

router.post('/*' , passport.authenticate('jwt', { session: false }));
// router.post('/userProfile', authController.userProfile) ;
// router.post('/createProfile', uploadAvatar, authController.createProfile) ;

module.exports = router;