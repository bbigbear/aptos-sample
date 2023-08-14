const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const passport = require('passport') ;

router.post('/*' , passport.authenticate('jwt', { session: false }));
router.post('/createStripe', userController.createStripe) ;
router.post('/incBalance', userController.incBalance) ;

module.exports = router;