const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const passport = require('passport') ;

router.get('/', cartController.allCartList);

router.use(passport.authenticate('jwt', { session: false }));
router.delete('/', cartController.cancelCart);
router.post('/addToCart', cartController.addToCart);
router.get('/cartList', cartController.cartList) ;
module.exports = router;